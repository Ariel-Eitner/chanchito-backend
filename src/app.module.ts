import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as morgan from 'morgan';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './transactions/module/transactions.module';
import { UsersModule } from './users/module/users.module';
import { AuthService } from './auth/service/auth.service';
import { WalletModule } from './wallet/module/wallet.module';
import { WalletService } from './wallet/service/wallet.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    TransactionsModule,
    UsersModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(morgan('dev'))
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
