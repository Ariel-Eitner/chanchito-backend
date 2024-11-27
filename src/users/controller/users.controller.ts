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
  BadRequestException,
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
  async createUserController(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.createUserService(createUserDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({ message: error.message });
      }
      if (error instanceof BadRequestException) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }

  // @Get()
  // async fetchAllUsersController(@Res() res: Response) {
  //   try {
  //     const users = await this.userService.fetchAllUsersService();
  //     return res.status(HttpStatus.OK).json({
  //       message: 'Users retrieved successfully',
  //       data: users,
  //     });
  //   } catch (error) {
  //     return res
  //       .status(HttpStatus.INTERNAL_SERVER_ERROR)
  //       .json({ message: 'An error occurred' });
  //   }
  // }

  @Get(':id')
  async fetchUserByIdController(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.fetchUserByIdService(id);
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
  async updateUserController(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.updateUserService(id, updateUserDto);
      return res.status(HttpStatus.OK).json({
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: error.message });
      } else if (error instanceof BadRequestException) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: error.message });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }

  @Delete(':id')
  async deleteUserController(
    @Param('id') id: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      await this.userService.deleteUserService(id, password);
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
