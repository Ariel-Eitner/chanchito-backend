import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../users.controller';

import {
  NotFoundException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from 'src/users/service/users.service';

describe('UserController - deleteUserController', () => {
  let controller: UserController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            deleteUserService: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should return 200 if the user is deleted successfully', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest.spyOn(userService, 'deleteUserService').mockResolvedValue(undefined);

    await controller.deleteUserController(
      'user-id',
      'password123',
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User deleted successfully',
    });
  });

  it('should return 404 if the user is not found', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(userService, 'deleteUserService')
      .mockRejectedValue(new NotFoundException('User not found'));

    await controller.deleteUserController(
      'user-id',
      'password123',
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User not found',
    });
  });

  it('should return 401 if the password is incorrect', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(userService, 'deleteUserService')
      .mockRejectedValue(new UnauthorizedException('Incorrect password'));

    await controller.deleteUserController(
      'user-id',
      'wrongpassword',
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Incorrect password',
    });
  });

  it('should return 500 if an unknown error occurs', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(userService, 'deleteUserService')
      .mockRejectedValue(new Error('Some unknown error'));

    await controller.deleteUserController(
      'user-id',
      'password123',
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'An error occurred',
    });
  });
});
