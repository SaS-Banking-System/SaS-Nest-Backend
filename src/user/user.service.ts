import {
  ConflictException,
  NotFoundException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    await this.prisma.accounts
      .create({
        data: createUserDto,
      })
      .catch(() => {
        throw new ConflictException();
      });
  }

  async deleteUser(deleteUserDto: DeleteUserDto) {
    await this.prisma.accounts
      .delete({
        where: {
          uuid: deleteUserDto.uuid,
        },
      })
      .catch(() => {
        throw new BadRequestException('could not delete user');
      });
  }

  async findAll() {
    return this.prisma.accounts.findMany();
  }

  async getUserInfo(uuid: string) {
    const user = await this.prisma.accounts.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!user) throw new NotFoundException();

    const userTransactions = await this.prisma.transaction.findMany({
      where: {
        OR: [{ sender: uuid }, { receiver: uuid }],
      },
    });

    return { user: user, transactions: userTransactions };
  }

  async findUsersByPartialUUID(partialUUID: string) {
    const users = await this.prisma.accounts.findMany({
      where: {
        uuid: {
          contains: partialUUID,
        },
      },
    });

    if (users.length === 0) throw new NotFoundException();

    return users;
  }

  async existsUser(uuid: string) {
    const user = await this.prisma.accounts.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!user) throw new NotFoundException();
  }

  async lockUser(uuid: string) {
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
        throw new NotFoundException('User with supplied uuid not found');
      });
  }

  async unlockUser(uuid: string) {
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
        throw new NotFoundException('User with supplied uuid not found');
      });
  }
}
