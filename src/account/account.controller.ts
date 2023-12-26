import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { DeleteAccountDto } from './dto/delete-account.dto';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Find all accounts',
  })
  findAll() {
    return this.accountService.findAll();
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Create an account',
  })
  @ApiConflictResponse({
    description: 'Account uuid must be unique',
  })
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    await this.accountService.createAccount(createAccountDto);
  }

  @Post('delete')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Deleted account',
  })
  @ApiBadRequestResponse({
    description: 'Could not delete account',
  })
  async deleteAccount(@Body() deleteAccountDto: DeleteAccountDto) {
    await this.accountService.deleteAccount(deleteAccountDto);
  }

  @Get(':uuid')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Find account by uuid',
  })
  @ApiNotFoundResponse({
    description: 'No account with given uuid was found',
  })
  async findAccountsByPartialUUID(@Param('uuid') partialUUID: string) {
    return await this.accountService.findAccountsByPartialUUID(partialUUID);
  }

  @Get('info/:uuid')
  @ApiOkResponse({
    description: 'Returns balance and all transations from an account',
  })
  @ApiNotFoundResponse({
    description: 'No account with given uuid was found',
  })
  async getAccountInfo(@Param('uuid') uuid: string) {
    return await this.accountService.getAccountInfo(uuid);
  }

  @Get('exist/:uuid')
  @ApiOkResponse({
    description: 'Account with given uuid exists',
  })
  @ApiNotFoundResponse({
    description: 'Account with given uuid does not exist',
  })
  async checkAccountExists(@Param('uuid') uuid: string) {
    return await this.accountService.existsAccount(uuid);
  }

  @Patch('lock/:uuid')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Locks an account with a given uuid',
  })
  @ApiNotFoundResponse({
    description: 'Account with supplied uuid not found',
  })
  @ApiForbiddenResponse({
    description: 'Account already locked',
  })
  async lockAccount(@Param('uuid') uuid: string) {
    await this.accountService.lockAccount(uuid);
  }

  @Patch('unlock/:uuid')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Unlocks account with given uuid',
  })
  @ApiNotFoundResponse({
    description: 'Account with supplied uuid not found',
  })
  @ApiForbiddenResponse({
    description: 'Account already unlocked',
  })
  async unlockAccount(@Param('uuid') uuid: string) {
    await this.accountService.unlockAccount(uuid);
  }
}
