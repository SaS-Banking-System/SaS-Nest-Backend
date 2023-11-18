import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.userService.createUser(createUserDto);
  }

  @Get(':uuid')
  async findUsersByPartialUUID(@Param('uuid') partialUUID: string) {
    return await this.userService.findUsersByPartialUUID(partialUUID);
  }

  @Get('info/:uuid')
  async getUserInfo(@Param('uuid') uuid: string) {
    return await this.userService.getUserInfo(uuid);
  }

  @Get('exist/:uuid')
  async checkUserExists(@Param('uuid') uuid: string) {
    return await this.userService.existsUser(uuid);
  }
}
