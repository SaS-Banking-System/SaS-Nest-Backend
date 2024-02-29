import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { DeleteAdminDto } from './dto/delete-admin.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, PrismaService],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // findAll function has no logic => no test needed

  it('should not create admin', async () => {
    let createAdminData: CreateAdminDto = {
      username: 'user',
      password: 'test',
    };

    prisma.admin.create = jest.fn().mockImplementationOnce(() => {
      return new Promise(() => {
        // simulates that an admin could not be created
        throw new Error();
      });
    });

    await expect(service.createAdmin(createAdminData)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should not delete admin', async () => {
    let deleteAdminData: DeleteAdminDto = {
      username: 'user',
    };

    prisma.admin.delete = jest.fn().mockImplementationOnce(() => {
      return new Promise(() => {
        // simulates that admin with given username does not exist
        throw new Error();
      });
    });

    await expect(service.deleteAdmin(deleteAdminData)).rejects.toThrow(
      NotFoundException,
    );
  });
});
