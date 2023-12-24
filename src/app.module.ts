import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [AccountModule, TransactionModule, AuthModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
