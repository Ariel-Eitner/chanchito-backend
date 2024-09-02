import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { TransactionsController } from '../controller/transactions.controller';
import { TransactionsService } from '../service/transactions.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsModule],
})
export class TransactionsModule {}
