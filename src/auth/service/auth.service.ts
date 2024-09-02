import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { UsersService } from 'src/users/service/users.service';
import { ChangePasswordDto } from '../dto/ChangePasswordDto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
export interface JwtPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  generateJwt(userId: string): string {
    const payload = { userId };
    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (
      !user ||
      !(await this.usersService.validatePassword(user, loginDto.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }
}
