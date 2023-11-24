import { Controller, Get, Post, Param, Body, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({
    description: 'Find all users',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Post('new')
  @ApiCreatedResponse({
    description: 'Create a user',
  })
  @ApiConflictResponse({
    description: 'User uuid must be unique',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.userService.createUser(createUserDto);
  }

  @Get(':uuid')
  @ApiOkResponse({
    description: 'Find user by uuid',
  })
  @ApiNotFoundResponse({
    description: 'No user with given uuid was found',
  })
  async findUsersByPartialUUID(@Param('uuid') partialUUID: string) {
    return await this.userService.findUsersByPartialUUID(partialUUID);
  }

  @Get('info/:uuid')
  @ApiOkResponse({
    description: 'Returns balance and all transations from a user',
  })
  @ApiNotFoundResponse({
    description: 'No user with given uuid was found',
  })
  async getUserInfo(@Param('uuid') uuid: string) {
    return await this.userService.getUserInfo(uuid);
  }

  @Get('exist/:uuid')
  @ApiOkResponse({
    description: 'User with given uuid exists',
  })
  @ApiNotFoundResponse({
    description: 'User with given uuid does not exist',
  })
  async checkUserExists(@Param('uuid') uuid: string) {
    return await this.userService.existsUser(uuid);
  }

  @Post('lock/:uuid')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Locks a user with a given uuid',
  })
  @ApiNotFoundResponse({
    description: 'User with supplied uuid not found',
  })
  async lockUser(@Param('uuid') uuid: string) {
    await this.userService.lockUser(uuid);
  }

  @Post('unlock/:uuid')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Unlocks user with given uuid',
  })
  @ApiNotFoundResponse({
    description: 'User with supplied uuid not found',
  })
  async unlockUser(@Param('uuid') uuid: string) {
    await this.userService.unlockUser(uuid);
  }
}
