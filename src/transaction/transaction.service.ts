import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    const transctions = await this.prisma.transaction.findMany();
    return transctions;
  }

  async newTransaction(createTransactionDto: CreateTransactionDto) {
    return await this.prisma.$transaction(async (tx) => {

      const sender = await tx.user.update({
        where: {
          uuid: createTransactionDto.sender
        },
        data: {
          balance: {
            decrement: createTransactionDto.amount
          }
        }
      }).catch(() => { throw new HttpException('sender not found', HttpStatus.FORBIDDEN) });

      if (sender.balance < 0) throw new HttpException('sender balance less than 0', HttpStatus.FORBIDDEN);

      await tx.user.update({
        where: {
          uuid: createTransactionDto.receiver
        },
        data: {
          balance: {
            increment: createTransactionDto.amount
          }
        }
      }).catch(() => { throw new HttpException('receiver not found', HttpStatus.FORBIDDEN) });

      await tx.transaction.create({
        data: {
          sender: createTransactionDto.sender,
          receiver: createTransactionDto.receiver,
          amount: createTransactionDto.amount,
        }
      })

      return sender;
    })
  }
}
