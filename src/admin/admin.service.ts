import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash as bcrypt_hash } from 'bcrypt';
import { DeleteAdminDto } from './dto/delete-admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        password: false,
      },
    });
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt_hash(createAdminDto.password, 10);

    await this.prisma.admin
      .create({
        data: {
          username: createAdminDto.username,
          password: hashedPassword,
        },
      })
      .catch((e) => {
        throw new ForbiddenException(e);
      });
  }

  async deleteAdmin(deleteAdminDto: DeleteAdminDto) {
    await this.prisma.admin
      .delete({
        where: {
          username: deleteAdminDto.username,
        },
      })
      .catch((e) => {
        throw new ForbiddenException(e);
      });
  }
}
