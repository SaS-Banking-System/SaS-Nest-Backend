import { Get, Post, Controller, Body, HttpCode } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Get()
  @ApiOkResponse({
    description: 'Get all transactions',
  })
  async findAll() {
    return await this.transactionService.findAll();
  }

  @ApiOkResponse({
    description: 'Transaction was successful',
  })
  @ApiForbiddenResponse({
    description: 'Something went wrong',
  })
  @Post('new')
  @HttpCode(200)
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const sender =
      await this.transactionService.newTransaction(createTransactionDto);
    return sender.balance;
  }
}
