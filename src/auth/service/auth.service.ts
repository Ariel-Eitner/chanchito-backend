import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { UsersService } from 'src/users/service/users.service';
export interface JwtPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  generateJwt(userId: string): string {
    const payload = { userId };
    return this.jwtService.sign(payload);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (
      !user
      // !(await this.usersService.validatePassword(user, loginDto.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  // async validateToken(token: string): Promise<any> {
  //   try {
  //     const decodedToken = this.jwtService.verify<JwtPayload>(token);
  //     console.log(decodedToken, 'decoded token');
  //     const user = await this.usersService.findById(decodedToken.sub);

  //     if (!user) {
  //       throw new UnauthorizedException('User not found');
  //     }

  //     return user; // Devuelve al usuario autenticado
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid token');
  //   }
  // }
}
