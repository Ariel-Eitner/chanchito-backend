import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserController } from '../controller/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthModule } from 'src/auth/module/auth.module';
import {
  Transaction,
  TransactionSchema,
} from 'src/transactions/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
