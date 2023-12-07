import { Body, Post, Controller, UseGuards } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { DeleteAdminDto } from './dto/delete-admin.dto';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  @UseGuards(AuthGuard)
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
