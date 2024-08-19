// src/auth/controller/auth.controller.ts
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
  //   return this.authService.login(loginDto);
  // }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken } = await this.authService.login(loginDto);

    // Configuración de la cookie HttpOnly
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production', // Solo enviar en HTTPS en producción
      maxAge: 1000 * 60 * 60 * 24, // 1 día
      sameSite: 'none', // Mejora la seguridad contra CSRF
    });

    return res
      .status(HttpStatus.OK)
      .json({ message: 'Login successful', token: accessToken });
  }
}
