import {
  ConflictException,
  NotFoundException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) { }

  async createAccount(createAccountDto: CreateAccountDto) {
    await this.prisma.accounts
      .create({
        data: createAccountDto,
      })
      .catch(() => {
        throw new ConflictException('account with same uuid already exists');
      });
  }

  async deleteAccount(deleteAccountDto: DeleteAccountDto) {
    await this.prisma.accounts
      .delete({
        where: {
          uuid: deleteAccountDto.uuid,
        },
      })
      .catch(() => {
        throw new BadRequestException('could not delete account');
      });
  }

  async findAll() {
    return this.prisma.accounts.findMany();
  }

  async getAccountInfo(uuid: string) {
    const account = await this.prisma.accounts.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!account) throw new NotFoundException();

    const accountTransactions = await this.prisma.transaction.findMany({
      where: {
        OR: [{ sender: uuid }, { receiver: uuid }],
      },
    });

    return { account: account, transactions: accountTransactions };
  }

  async findAccountsByPartialUUID(partialUUID: string) {
    const accounts = await this.prisma.accounts.findMany({
      where: {
        uuid: {
          contains: partialUUID,
        },
      },
    });

    if (accounts.length === 0) throw new NotFoundException();

    return accounts;
  }

  async existsAccount(uuid: string) {
    const account = await this.prisma.accounts.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!account) throw new NotFoundException();
  }

  async lockAccount(uuid: string) {
    await this.prisma.accounts
      .update({
        where: {
          uuid: uuid,
        },
        data: {
          locked: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('account with supplied uuid not found');
      });
  }

  async unlockAccount(uuid: string) {
    await this.prisma.accounts
      .update({
        where: {
          uuid: uuid,
        },
        data: {
          locked: false,
        },
      })
      .catch(() => {
        throw new NotFoundException('account with supplied uuid not found');
      });
  }
}
