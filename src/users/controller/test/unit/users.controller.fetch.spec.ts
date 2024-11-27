import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../users.controller';
import { UsersService, UserWithToken } from '../../../service/users.service';
import { NotFoundException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schemas/user.schema';

describe('UserController - fetchUserByIdController', () => {
  let controller: UserController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            fetchUserByIdService: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should retrieve a user successfully', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockUser: User = {
      ...CreateUserDto,
      firstName: 'ariel',
      email: 'ariel@ariel.com',
      password: 'password',
      isActive: true,
      secondName: undefined,
      lastName: undefined,
      transactions: [],
      role: ['user'],
      profilePictureUrl: '',
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptions: [],
    };

    jest.spyOn(userService, 'fetchUserByIdService').mockResolvedValue(mockUser);

    await controller.fetchUserByIdController('user-id', mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User retrieved successfully',
      data: mockUser,
    });
  });

  it('should handle NotFoundException if user is not found', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(userService, 'fetchUserByIdService')
      .mockRejectedValue(
        new NotFoundException('User with ID "user-id" not found'),
      );

    await controller.fetchUserByIdController('user-id', mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User with ID "user-id" not found',
    });
  });

  it('should handle unexpected errors', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    jest
      .spyOn(userService, 'fetchUserByIdService')
      .mockRejectedValue(new Error('Unexpected error'));

    await controller.fetchUserByIdController('user-id', mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'An error occurred',
    });
  });
});
