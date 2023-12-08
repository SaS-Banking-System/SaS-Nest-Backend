import { Get, Body, Post, Controller, UseGuards } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { DeleteAdminDto } from './dto/delete-admin.dto';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @UseGuards()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'get all admins',
  })
  @ApiForbiddenResponse({
    description: 'no access',
  })
  async findAll() {
    return this.adminService.findAll();
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'created admin',
  })
  @ApiForbiddenResponse({
    description: 'could not create new admin',
  })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    await this.adminService.createAdmin(createAdminDto);
  }

  @Post('delete')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'deleted admin',
  })
  @ApiForbiddenResponse({
    description: 'could not delete admin',
  })
  async deleteAdmin(@Body() deleteAdminDto: DeleteAdminDto) {
    await this.adminService.deleteAdmin(deleteAdminDto);
  }
}
