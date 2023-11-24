import { ForbiddenException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const transctions = await this.prisma.transaction.findMany();
    return transctions;
  }

  async newTransaction(createTransactionDto: CreateTransactionDto) {
    return await this.prisma.$transaction(async (tx) => {
      const sender = await tx.user
        .update({
          where: {
            uuid: createTransactionDto.sender,
          },
          data: {
            balance: {
              decrement: createTransactionDto.amount,
            },
          },
        })
        .catch(() => {
          throw new ForbiddenException('sender not found');
        });

      if (sender.locked) throw new ForbiddenException('sender is locked');

      if (sender.balance < 0)
        throw new ForbiddenException('sender balance to low');

      const receiver = await tx.user
        .update({
          where: {
            uuid: createTransactionDto.receiver,
          },
          data: {
            balance: {
              increment: createTransactionDto.amount,
            },
          },
        })
        .catch(() => {
          throw new ForbiddenException('receiver not found');
        });

      await tx.transaction.create({
        data: {
          sender: createTransactionDto.sender,
          receiver: createTransactionDto.receiver,
          amount: createTransactionDto.amount,
        },
      });

      if (receiver.locked) throw new ForbiddenException('receiver locked');

      return sender;
    });
  }
}
