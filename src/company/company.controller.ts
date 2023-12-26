import { Post, Body, Controller, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { DeleteCompanyDto } from './dto/delete-company.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Find all companies'
  })
  async findAll() {
    return await this.companyService.findAll();
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Create a company'
  })
  @ApiConflictResponse({
    description: 'Could not create company'
  })
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    await this.companyService.createCompany(createCompanyDto)
  }

  @Post('delete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Delete company'
  })
  @ApiBadRequestResponse({
    description: 'Could not delete company'
  })
  async deleteCompany(@Body() deleteCompanyDto: DeleteCompanyDto) {
    await this.companyService.deleteCompany(deleteCompanyDto)
  }
}
