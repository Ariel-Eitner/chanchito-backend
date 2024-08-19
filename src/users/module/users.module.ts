import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserController } from '../controller/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthModule } from 'src/auth/module/auth.module'; // Importa el AuthModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule), // Asegúrate de importar el AuthModule aquí
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
