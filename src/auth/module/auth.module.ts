import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../service/auth.service';
import { UsersModule } from 'src/users/module/users.module';
import { AuthController } from '../controller/auth.controller';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET;

@Module({
  imports: [
    ConfigModule,

    forwardRef(() => UsersModule),
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: secret, // Asegúrate de que JWT_SECRET esté configurado en tu archivo de configuración
        signOptions: {
          expiresIn: '60m', // Duración del token
        },
      }),
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, JwtAuthGuard, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, AuthModule, JwtModule],
})
export class AuthModule {}
