import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [UserModule, TransactionModule, AuthModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
