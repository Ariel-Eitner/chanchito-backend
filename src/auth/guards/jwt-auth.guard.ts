import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies['accessToken'];
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        // Token expirado
        throw new UnauthorizedException(
          'Token has expired. Please log in again.',
        );
      } else if (err.name === 'JsonWebTokenError') {
        // Token inválido
        throw new UnauthorizedException(
          'Invalid token. Please provide a valid token.',
        );
      } else {
        // Otro tipo de error
        throw new UnauthorizedException(
          'Could not authenticate. Please try again.',
        );
      }
    }
    return true;
  }
}
