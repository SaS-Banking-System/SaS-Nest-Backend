import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DeleteCompanyDto } from './dto/delete-company.dto';

interface CompanyInfo {
  name: string;
  code: string;
  taxAmount: number;
}

describe('CompanyService', () => {
  let service: CompanyService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyService, PrismaService],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // company create function has no logic =>

  it('should not create a company', async () => {
    const companyCreateData: CreateCompanyDto = {
      name: 'Test name',
      uuid: 'test',
      code: '1234',
      taxAmount: 0.2,
    };

    prisma.company.create = jest.fn().mockImplementationOnce(() => {
      return new Promise(() => {
        // simulates that prisma threw an error (record not found)
        throw new Error();
      });
    });

    await expect(service.createCompany(companyCreateData)).rejects.toThrow(
      ConflictException,
    );
  });

  // company delete function has no logic => no test

  it('should not delete a company', async () => {
    const companyDeleteData: DeleteCompanyDto = {
      uuid: 'testuuid',
    };

    prisma.company.delete = jest.fn().mockImplementationOnce(() => {
      return new Promise(() => {
        // simulates that prisma threw an error (record not found)
        throw new Error();
      });
    });

    await expect(service.deleteCompany(companyDeleteData)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should get company info', async () => {
    const companyCode = '1234';

    const companyInfo: CompanyInfo = {
      name: 'test company',
      code: '1234',
      taxAmount: 0.2,
    };

    // returns compnay data by uuid uuid
    prisma.company.findUnique = jest.fn().mockResolvedValue(companyInfo);

    await expect(service.getInfo(companyCode)).resolves.toStrictEqual(
      companyInfo,
    );
  });

  it('should not get company info, no company found', async () => {
    const companyCode = '1234';

    // simulates that no company was found
    prisma.company.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.getInfo(companyCode)).rejects.toThrow(
      NotFoundException,
    );
  });
});
