import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import 'dotenv-defaults/config';
import { CreateCompanyTransactionDto } from './dto/create-company-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const transctions = await this.prisma.transaction.findMany();
    return transctions;
  }

  async newTransaction(createTransactionDto: CreateTransactionDto) {
    return await this.prisma.$transaction(async (tx) => {
      const receiver = await tx.account.findUnique({
        where: {
          uuid: createTransactionDto.receiver,
        },
      });

      const sender = await tx.account.findUnique({
        where: {
          uuid: createTransactionDto.sender,
        },
      });

      if (!sender) throw new ForbiddenException('sender not found');
      if (sender.locked) throw new ForbiddenException('sender is locked');

      if (!receiver) throw new ForbiddenException('receiver not found');
      if (receiver.locked) throw new ForbiddenException('receiver is locked');

      const senderAfterTransaction = await tx.account.update({
        where: {
          uuid: createTransactionDto.sender,
        },
        data: {
          balance: {
            decrement: createTransactionDto.amount,
          },
        },
      });

      if (senderAfterTransaction.balance < 0)
        throw new ForbiddenException('sender balance too low');

      const receiverCompanyData = await tx.company.findUnique({
        where: {
          uuid: createTransactionDto.receiver,
        },
      });

      // if receiver is not a company
      if (!receiverCompanyData) {
        await tx.account.update({
          where: {
            uuid: createTransactionDto.receiver,
          },
          data: {
            balance: {
              increment: createTransactionDto.amount,
            },
          },
        });

        await tx.transaction.create({
          data: {
            sender: createTransactionDto.sender,
            receiver: createTransactionDto.receiver,
            amount: createTransactionDto.amount,
            // -1 indicates that the transaction was between 2 non company accounts
            tax: -1,
          },
        });

        // if receiver is a company
      } else {
        // how much tax there is on a company
        const taxAmount = receiverCompanyData.taxAmount;

        // amount that the state gets
        const stateAmount = Math.floor(createTransactionDto.amount * taxAmount);

        // amount that the receiver gets
        const amountAfterTax = createTransactionDto.amount - stateAmount;

        await tx.account.update({
          where: {
            uuid: createTransactionDto.receiver,
          },
          data: {
            balance: {
              increment: amountAfterTax,
            },
          },
        });

        await tx.account.update({
          where: {
            uuid: process.env.STATE_ACCOUNT,
          },
          data: {
            balance: {
              increment: stateAmount,
            },
          },
        });

        await tx.transaction.create({
          data: {
            sender: createTransactionDto.sender,
            receiver: createTransactionDto.receiver,
            amount: amountAfterTax,
            tax: stateAmount,
          },
        });
      }

      return senderAfterTransaction;
    });
  }

  async newCompanyTransaction(
    createCompanyTransactionDto: CreateCompanyTransactionDto,
  ) {
    const company = await this.prisma.company.findUnique({
      where: {
        code: createCompanyTransactionDto.code,
      },
    });

    if (!company) throw new NotFoundException('no company with code found');

    const createTransactionDto: CreateTransactionDto = {
      sender: createCompanyTransactionDto.sender,
      receiver: company.uuid,
      amount: createCompanyTransactionDto.amount,
    };

    return await this.newTransaction(createTransactionDto);
  }
}
