import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      await this.prisma.user.create({
        data: createUserDto,
      });
    } catch {
      throw new ConflictException('conflict');
    }
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findUsersByPartialUUID(partialUUID: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        uuid: {
          contains: partialUUID,
        },
      },
    });

    if (!users) throw new NotFoundException();

    return users;
  }
}
