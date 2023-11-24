import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    await this.prisma.user
      .create({
        data: createUserDto,
      })
      .catch(() => {
        throw new ConflictException();
      });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async getUserInfo(uuid: string) {
    const user = await this.prisma.user.findUnique({
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

  async findUsersByPartialUUID(partialUUID: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
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
    const user = await this.prisma.user.findUnique({
      where: {
        uuid: uuid,
      },
    });

    if (!user) throw new NotFoundException();
  }

  async lockUser(uuid: string) {
    await this.prisma.user
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
    await this.prisma.user
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
