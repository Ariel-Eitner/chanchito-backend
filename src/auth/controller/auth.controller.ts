import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UnauthorizedException,
  Req,
  UseGuards,
  Put,
  HttpException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { Response } from 'express';
import { AuthenticatedRequest, JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ChangePasswordDto } from '../dto/ChangePasswordDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginController(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const { accessToken } = await this.authService.loginService(loginDto);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 1 día
        sameSite: 'strict',
      });

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Login successful', token: accessToken });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Invalid credentials. Please check your email and password.',
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'An unexpected error occurred. Please try again later.',
      });
    }
  }

  @Post('logout')
  logoutController(@Req() req: Request, @Res() res: Response) {
    // Aquí puedes manejar la invalidación de tokens en el backend si es necesario

    // Limpia la cookie si estás usando una
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 0,

      // secure: true, // Usar `true` si estás en producción con HTTPS
    });

    return res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePasswordController(
    @Req() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    try {
      const token = req.cookies['accessToken'] || req.headers.authorization;
      if (!token) {
        throw new UnauthorizedException('Token missing');
      }
      const userId = req.user.sub;
      await this.authService.changePasswordService(userId, changePasswordDto);

      return {
        statusCode: HttpStatus.OK,
        message: 'Contraseña cambiada exitosamente',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new HttpException(
          'La contraseña actual es incorrecta.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        'Ocurrió un error inesperado. Inténtalo nuevamente más tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
