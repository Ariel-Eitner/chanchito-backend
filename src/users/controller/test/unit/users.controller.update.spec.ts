import { Test, TestingModule } from '@nestjs/testing';

import {
  NotFoundException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserController } from '../../users.controller';
import { UsersService } from 'src/users/service/users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/schemas/user.schema';

describe('UserController - updateUserController', () => {
  let controller: UserController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            updateUserService: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should update the user successfully', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockUser: User = {
      _id: 'user-id',
      firstName: 'John',
      secondName: 'Doe',
      email: 'john@example.com',
      password: 'password',
      subscriptions: [], // Correcto campo 'subscriptions'
      isActive: true,
      transactions: [],
      role: ['user'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updateUserDto: UpdateUserDto = {
      firstName: 'Jane',
      email: 'jane@example.com',
    };

    jest.spyOn(userService, 'updateUserService').mockResolvedValue({
      ...mockUser,
      ...updateUserDto,
    });

    await controller.updateUserController(
      'user-id',
      updateUserDto,
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User updated successfully',
      data: {
        ...mockUser,
        ...updateUserDto,
      },
    });
  });

  it('should return 404 if user is not found', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const updateUserDto: UpdateUserDto = {
      firstName: 'Jane',
      email: 'jane@example.com',
    };

    jest
      .spyOn(userService, 'updateUserService')
      .mockRejectedValue(
        new NotFoundException('User with ID "user-id" not found'),
      );

    await controller.updateUserController(
      'user-id',
      updateUserDto,
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User with ID "user-id" not found',
    });
  });

  it('should return 500 if an unexpected error occurs', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const updateUserDto: UpdateUserDto = {
      firstName: 'Jane',
      email: 'jane@example.com',
    };

    jest
      .spyOn(userService, 'updateUserService')
      .mockRejectedValue(new Error('Unexpected error'));

    await controller.updateUserController(
      'user-id',
      updateUserDto,
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'An error occurred',
    });
  });

  it('should return 400 if the update data is invalid', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const invalidUpdateUserDto = {
      firstName: '', // Simulate validation error: required field is empty
    };

    jest
      .spyOn(userService, 'updateUserService')
      .mockRejectedValue(new BadRequestException('Validation failed'));

    await controller.updateUserController(
      'user-id',
      invalidUpdateUserDto as any,
      mockResponse,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation failed',
    });
  });
});
