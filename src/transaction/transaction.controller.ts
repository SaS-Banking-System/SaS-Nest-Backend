import {
  Get,
  Post,
  Controller,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCompanyTransactionDto } from './dto/create-company-transaction.dto';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get all transactions',
  })
  async findAll() {
    return await this.transactionService.findAll();
  }

  @Post('new')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Transaction was successful',
  })
  @ApiForbiddenResponse({
    description: 'Something went wrong',
  })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const sender =
      await this.transactionService.newTransaction(createTransactionDto);
    return sender.balance;
  }

  @Post('company/new')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Transaction was successful',
  })
  @ApiForbiddenResponse({
    description: 'Something went wrong',
  })
  async createComanyTransaction(
    @Body() createCompanyTransactionDto: CreateCompanyTransactionDto
  ) {
    const sender = await this.transactionService.newCompanyTransaction(
      createCompanyTransactionDto
    );

    return sender.balance;
  }
}
