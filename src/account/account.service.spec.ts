import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

interface Account {
  id: number;
  uuid: string;
  locked: boolean;
  balance: number;
}

interface Transaction {
  id: number;
  sender: string;
  receiver: string;
  amount: number;
  private: boolean;
  tax: number;
  createdAt: Date;
}

describe('AccountService', () => {
  let service: AccountService;
  let prisma: PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService, PrismaService],
    }).compile();

    service = module.get<AccountService>(AccountService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not create account', async () => {
    const accountCreateData: CreateAccountDto = {
      uuid: 'testuuid',
      balance: 0,
    };

    // simulate that given uuid is already stored in the db => ConflictException
    prisma.account.create = jest.fn().mockImplementationOnce(() => {
      return new Promise(() => {
        // simulates that prisma threw an error
        throw new Error();
      });
    });

    await expect(service.createAccount(accountCreateData)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should create 3 users by csv', async () => {
    const mockFileContents = `Snyder, Ward,
       Hardy, Zeph,
       Doyle, Tilda,
      `;
    const mockFile: Express.Multer.File = {
      fieldname: null,
      originalname: null,
      encoding: null,
      mimetype: null,
      size: null,
      stream: null,
      destination: null,
      filename: null,
      path: null,
      buffer: Buffer.from(mockFileContents),
    };

    prisma.account.create = jest.fn().mockResolvedValue(undefined);

    await expect(service.createAccountByCSV(mockFile)).resolves.toBe(3);
  });

  it('should not create users by csv, empty file', async () => {
    const mockFileContents = '';

    const mockFile: Express.Multer.File = {
      fieldname: null,
      originalname: null,
      encoding: null,
      mimetype: null,
      size: null,
      stream: null,
      destination: null,
      filename: null,
      path: null,
      buffer: Buffer.from(mockFileContents),
    };

    prisma.account.create = jest.fn().mockResolvedValue(undefined);

    await expect(service.createAccountByCSV(mockFile)).resolves.toBe(0);
  });

  it('should not create 2 users by csv, some names are undefined', async () => {
    const mockFileContents = `  , ,
       Hardy, Zeph,
       Doyle, Tilda,
      `;
    const mockFile: Express.Multer.File = {
      fieldname: null,
      originalname: null,
      encoding: null,
      mimetype: null,
      size: null,
      stream: null,
      destination: null,
      filename: null,
      path: null,
      buffer: Buffer.from(mockFileContents),
    };

    prisma.account.create = jest.fn().mockResolvedValue(undefined);

    await expect(service.createAccountByCSV(mockFile)).resolves.toBe(2);
  });

  it('should not create users by csv, cannot parse file', async () => {
    const mockFileContents = `  , ,
       Hardy, Something, Zeph,
       Doyle, Tilda,
      `;
    const mockFile: Express.Multer.File = {
      fieldname: null,
      originalname: null,
      encoding: null,
      mimetype: null,
      size: null,
      stream: null,
      destination: null,
      filename: null,
      path: null,
      buffer: Buffer.from(mockFileContents),
    };

    prisma.account.create = jest.fn().mockResolvedValue(undefined);

    await expect(service.createAccountByCSV(mockFile)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should not delete account', async () => {
    const accountDeleteData: DeleteAccountDto = {
      uuid: 'testuuid',
    };

    // simulate that given uuid is not found => BadRequestException
    prisma.account.create = jest.fn().mockImplementationOnce(() => {
      return new Promise(() => {
        // simulates that prisma threw an error
        throw new Error();
      });
    });

    await expect(service.deleteAccount(accountDeleteData)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should get account info -> {account: account, transactions: accountTransactions}', async () => {
    const uuid = 'testuuid';

    process.env.TIMESTAMP_LANG = 'de-DE';

    const accountData: Account = {
      id: 1,
      uuid: 'test-uuid',
      locked: false,
      balance: 100,
    };

    const accountTransactions: Transaction[] = [
      {
        id: 1,
        sender: 'test1',
        receiver: 'test2',
        amount: 10,
        private: true,
        tax: 0,
        createdAt: new Date('2024-02-29T14:07:54.184Z'),
      },
      {
        id: 2,
        sender: 'test2',
        receiver: 'test1',
        amount: 18,
        private: false,
        tax: 2,
        createdAt: new Date('2024-02-29T14:09:32.986Z'),
      },
    ];

    prisma.account.findUnique = jest
      .fn()
      // get account info by uuid
      .mockResolvedValueOnce(accountData);

    prisma.transaction.findMany = jest
      .fn()
      // get account transactions by uuid
      .mockResolvedValueOnce(accountTransactions);

    await expect(service.getAccountInfo(uuid)).resolves.toStrictEqual({
      account: accountData,
      transactions: [
        {
          id: 1,
          sender: 'test1',
          receiver: 'test2',
          amount: 10,
          private: true,
          tax: 0,
          createdAt: '29. Februar 2024 um 15:07:54',
        },
        {
          id: 2,
          sender: 'test2',
          receiver: 'test1',
          amount: 18,
          private: false,
          tax: 2,
          createdAt: '29. Februar 2024 um 15:09:32',
        },
      ],
    });
  });

  it('should find account info -> {account: account, transactions: null}', async () => {
    const uuid = 'testuuid';
    const accountData = {
      id: 1,
      uuid: 'testuuid',
      locked: false,
      balance: 100,
    };

    prisma.account.findUnique = jest
      .fn()
      // get account info by uuid
      .mockResolvedValueOnce(accountData);

    prisma.transaction.findMany = jest
      .fn()
      // account has no transactions
      .mockResolvedValueOnce(null);

    await expect(service.getAccountInfo(uuid)).resolves.toStrictEqual({
      account: accountData,
      transactions: null,
    });
  });

  it('should find accounts by partial uuid', async () => {
    const partialUUID = 'testuuid';

    const accountData: Account = {
      id: 1,
      uuid: 'test-uuid',
      locked: false,
      balance: 100,
    };

    prisma.account.findMany = jest
      .fn()
      // accounts that contain the partial uuid
      .mockResolvedValueOnce([accountData]);

    await expect(
      service.findAccountsByPartialUUID(partialUUID),
    ).resolves.toStrictEqual([accountData]);
  });

  it('should not find account by partial uuid', async () => {
    const partialUUID = 'testuuid';

    prisma.account.findMany = jest
      .fn()
      // no accounts found that contain given partial uuid
      .mockResolvedValueOnce([]);

    await expect(
      service.findAccountsByPartialUUID(partialUUID),
    ).rejects.toThrow(NotFoundException);
  });

  it('should not find an existen account', async () => {
    const uuid = 'testuuid';

    prisma.account.findUnique = jest.fn().mockResolvedValueOnce(null);

    await expect(service.existsAccount(uuid)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should lock account', async () => {
    const uuid = 'testuuid';

    const accountData: Account = {
      id: 1,
      uuid: 'test-uuid',
      // account is not locked
      locked: false,
      balance: 100,
    };

    prisma.account.findUnique = jest.fn().mockResolvedValueOnce(accountData);

    prisma.account.update = jest
      .fn()
      // return value is not used
      .mockResolvedValueOnce(undefined);

    await expect(service.lockAccount(uuid)).resolves.toBeTruthy();
  });

  it('should not lock account, no user found', async () => {
    const uuid = 'testuuid';

    prisma.account.findUnique = jest.fn().mockImplementationOnce(() => {
      return new Promise(() => {
        // simulates that prisma threw an error (no user found)
        throw new Error();
      });
    });

    await expect(service.lockAccount(uuid)).rejects.toThrow(NotFoundException);
  });

  it('should not lock account, user already locked', async () => {
    const uuid = 'testuuid';

    const accountData: Account = {
      id: 1,
      uuid: 'test-uuid',
      locked: true,
      balance: 100,
    };

    prisma.account.findUnique = jest.fn().mockResolvedValueOnce(accountData);

    prisma.account.update = jest.fn().mockImplementationOnce(() => {
      return new Promise(() => {
        // could not update accout, accout already locked
        throw new Error();
      });
    });

    await expect(service.lockAccount(uuid)).rejects.toThrow(ForbiddenException);
  });

  it('should unlock account', async () => {
    const uuid = 'testuuid';

    const accountData: Account = {
      id: 1,
      uuid: 'test-uuid',
      // account is not locked
      locked: true,
      balance: 100,
    };

    prisma.account.findUnique = jest.fn().mockResolvedValueOnce(accountData);

    prisma.account.update = jest
      .fn()
      // return value is not used
      .mockResolvedValueOnce(undefined);

    await expect(service.unlockAccount(uuid)).resolves.toBeTruthy();
  });

  it('should not unlock account, no user found', async () => {
    const uuid = 'testuuid';

    prisma.account.findUnique = jest.fn().mockImplementationOnce(() => {
      return new Promise(() => {
        // simulates that prisma threw an error (no user found)
        throw new Error();
      });
    });

    await expect(service.unlockAccount(uuid)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should not unlock account, user already unlocked', async () => {
    const uuid = 'testuuid';

    const accountData: Account = {
      id: 1,
      uuid: 'test-uuid',
      locked: false,
      balance: 100,
    };

    prisma.account.findUnique = jest.fn().mockResolvedValueOnce(accountData);

    prisma.account.update = jest.fn().mockImplementationOnce(() => {
      return new Promise(() => {
        // could not update accout, accout already locked
        throw new Error();
      });
    });

    await expect(service.unlockAccount(uuid)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
