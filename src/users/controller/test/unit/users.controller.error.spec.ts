import {
  HttpStatus,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserController } from '../../users.controller';
import { UsersService } from '../../../service/users.service';
import { CreateUserDto } from '../../../dto/create-user.dto';

describe('UserController - Error Handling', () => {
  let controller: UserController;
  let userService: UsersService;

  beforeEach(() => {
    userService = {
      createUserService: jest.fn(),
    } as unknown as UsersService;

    controller = new UserController(userService);
  });

  it('should handle ConflictException', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const createUserDto: CreateUserDto = {
      firstName: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      isActive: true,
    };

    jest
      .spyOn(userService, 'createUserService')
      .mockRejectedValue(new ConflictException('Email already exists'));

    await controller.createUserController(createUserDto, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Email already exists',
    });
  });

  it('should handle BadRequestException', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const createUserDto: CreateUserDto = {
      firstName: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      isActive: true,
    };

    jest
      .spyOn(userService, 'createUserService')
      .mockRejectedValue(new BadRequestException('Invalid data'));

    await controller.createUserController(createUserDto, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid data',
    });
  });

  it('should handle unexpected errors', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const createUserDto: CreateUserDto = {
      firstName: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      isActive: true,
    };

    jest
      .spyOn(userService, 'createUserService')
      .mockRejectedValue(new Error('Unexpected error'));

    await controller.createUserController(createUserDto, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'An error occurred',
    });
  });

  // Otros casos de error pueden ir aquí...
});
