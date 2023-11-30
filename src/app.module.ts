import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionService } from './transaction/transaction.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    UserController,
    TransactionController,
    AuthController,
  ],
  providers: [
    AppService,
    UserService,
    PrismaService,
    TransactionService,
    AuthService,
  ],
})
export class AppModule {}
