import { Post, Controller, Body, HttpCode } from '@nestjs/common'
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post('new')
  @HttpCode(200)
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const sender = await this.transactionService.newTransaction(createTransactionDto);
    return sender.balance;
  }
}
