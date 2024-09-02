import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
  Res,
  NotFoundException,
  ConflictException,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.userService.create(createUserDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({ message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }

  @Get()
  async fetchAll(@Res() res: Response) {
    try {
      const users = await this.userService.fetchAll();
      return res.status(HttpStatus.OK).json({
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }

  @Get(':id')
  async fetchById(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.fetchById(id);
      return res.status(HttpStatus.OK).json({
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return res.status(HttpStatus.OK).json({
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      await this.userService.delete(id, password);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      }
      if (error instanceof UnauthorizedException) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Incorrect password' });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }
}
