import {
  ConflictException,
  NotFoundException,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { parse as csv_parse } from 'csv-parse/sync';
import { randomUUID } from 'crypto';

interface CSVUser {
  firstName: string;
  lastName: string;
  uuid: string;
}

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(createAccountDto: CreateAccountDto) {
    await this.prisma.account
      .create({
        data: createAccountDto,
      })
      .catch(() => {
        throw new ConflictException('account with same uuid already exists');
      });
  }

  async createAccountByCSV(file: Express.Multer.File) {
    const fileContent = file.buffer.toString('utf8');

    let parsedFile;

    try {
      parsedFile = csv_parse(fileContent);
    } catch {
      throw new BadRequestException('could not parse csv file');
    }

    let CSVUsers: CSVUser[] = [];
    let addedUsers: number = 0;

    parsedFile.forEach((user) => {
      let csvUser: CSVUser = {
        firstName: user[1],
        lastName: user[0],
        uuid: randomUUID(),
      };

      if (!user[1] || !user[0]) return;
      addedUsers++;

      CSVUsers.push(csvUser);
    });

    await this.prisma.$transaction(async (tx) => {
      await Promise.all(
        CSVUsers.map(async (user: CSVUser) => {
          await tx.account.create({
            data: {
              uuid: user.uuid,
              firstName: user.firstName,
              lastName: user.lastName,
              balance: 0,
              locked: false,
            },
          });
        }),
      );
    });

    return addedUsers;
  }

  async deleteAccount(deleteAccountDto: DeleteAccountDto) {
    await this.prisma.account
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
    return this.prisma.account.findMany();
  }

  async getAccountInfo(uuid: string) {
    const account = await this.prisma.account.findUnique({
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

    if (!accountTransactions) return { account: account, transactions: null };

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Europe/Berlin',
    };

    accountTransactions.map((transaction: any) => {
      transaction.createdAt = transaction.createdAt.toLocaleString(
        process.env.TIMESTAMP_LANG,
        options,
      );
    });

    return { account: account, transactions: accountTransactions };
  }

  async findAccountsByPartialUUID(partialUUID: string) {
    const accounts = await this.prisma.account.findMany({
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
    const account = await this.prisma.account.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!account) throw new NotFoundException();
  }

  async lockAccount(uuid: string) {
    const account = await this.prisma.account.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (account.locked) throw new ForbiddenException('account already locked');

    await this.prisma.account
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
    const account = await this.prisma.account.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!account.locked)
      throw new ForbiddenException('account already unlocked');

    await this.prisma.account
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
