import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthService } from 'src/auth/service/auth.service';
import * as bcrypt from 'bcrypt';

import { ConflictException } from '@nestjs/common';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from '../../users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

describe('UsersService - createUserService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            generateJwtService: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    authService = module.get<AuthService>(AuthService);
  });

  // it('should create a new user and return a token', async () => {
  //   const createUserDto: CreateUserDto = {
  //     email: 'test@example.com',
  //     password: 'password123',
  //     firstName: 'John',
  //     isActive: true,
  //   };

  //   const mockUser = {
  //     ...createUserDto,
  //     _id: 'user-id',
  //     password: 'hashed-password',
  //   } as UserDocument;
  //   const mockToken = 'token';

  //   jest.spyOn(userModel, 'findOne').mockResolvedValue(null as any);
  //   jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
  //   jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
  //   jest.spyOn(userModel, 'create').mockResolvedValue(mockUser);
  //   jest.spyOn(authService, 'generateJwtService').mockReturnValue(mockToken);

  //   const result = await service.createUserService(createUserDto);

  //   expect(result).toEqual({ user: mockUser, token: mockToken });
  // });

  it('should throw ConflictException if email already exists', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      isActive: true,
    };

    jest.spyOn(userModel, 'findOne').mockResolvedValue(createUserDto as any);

    await expect(service.createUserService(createUserDto)).rejects.toThrow(
      ConflictException,
    );
  });
});
