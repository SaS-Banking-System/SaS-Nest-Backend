import { Body, Post, Controller, UseGuards } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { DeleteAdminDto } from './dto/delete-admin.dto';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    await this.adminService.createAdmin(createAdminDto);
  }

  @UseGuards(AuthGuard)
  @Post('delete')
  async deleteAdmin(@Body() deleteAdminDto: DeleteAdminDto) {
    await this.adminService.deleteAdmin(deleteAdminDto);
  }
}
