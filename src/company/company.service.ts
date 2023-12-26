import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { DeleteCompanyDto } from './dto/delete-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return await this.prisma.company.findMany();
  }

  async createCompany(createCompanyDto: CreateCompanyDto) {
    await this.prisma.company
      .create({
        data: createCompanyDto,
      })
      .catch(() => {
        throw new ConflictException('could not create company');
      });
  }

  async deleteCompany(deleteCompanyDto: DeleteCompanyDto) {
    await this.prisma.company
      .delete({
        where: deleteCompanyDto,
      })
      .catch(() => {
        throw new BadRequestException('could not delete company');
      });
  }
}
