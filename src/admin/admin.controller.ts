import { Body, Post, Controller } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { DeleteAdminDto } from './dto/delete-admin.dto';

@Controller('admin')
export class AdminController {
  @Post('create')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {}

  @Post('delete')
  async deleteAdmin(@Body() deleteAdminDto: DeleteAdminDto) {}
}
