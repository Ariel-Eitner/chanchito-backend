import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserController } from '../../users.controller';
import { UsersService, UserWithToken } from '../../../service/users.service';
import { CreateUserDto } from '../../../dto/create-user.dto';

describe('UserController - Create User', () => {
  let controller: UserController;
  let userService: UsersService;

  beforeEach(() => {
    userService = {
      createUserService: jest.fn(),
    } as unknown as UsersService;

    controller = new UserController(userService);
  });

  it('should create a user and return success response', async () => {
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
    const mockUser: UserWithToken = {
      user: {
        ...createUserDto,
        secondName: undefined,
        lastName: undefined,
        transactions: [],
        role: ['user'],
        profilePictureUrl: '',
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        subscriptions: [],
      },
      token: 'token',
    };

    jest.spyOn(userService, 'createUserService').mockResolvedValue(mockUser);

    await controller.createUserController(createUserDto, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      data: mockUser,
    });
  });

  // Otros casos relacionados a la creación pueden ir aquí...
});
