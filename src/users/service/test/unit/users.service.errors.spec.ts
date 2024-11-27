import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Transaction } from 'src/transactions/schemas/transaction.schema';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users.service';
import { User, UserDocument } from 'src/users/schemas/user.schema';

describe('UsersService - Error Handling', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;
  let transactionModel: Model<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('Transaction'),
          useValue: {
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    transactionModel = module.get<Model<Transaction>>(
      getModelToken('Transaction'),
    );
  });

  it('should handle general errors correctly', async () => {
    jest
      .spyOn(userModel, 'findById')
      .mockRejectedValue(new Error('Database error'));

    await expect(service.fetchUserByIdService('user-id')).rejects.toThrow(
      Error,
    );
  });

  // it('should handle bcrypt errors', async () => {
  //   const mockUser = { _id: 'user-id', password: 'hashed-password' } as any;

  //   jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser);
  //   jest.spyOn(bcrypt, 'compare').mockRejectedValue(new Error('bcrypt error'));

  //   await expect(
  //     service.deleteUserService('user-id', 'password'),
  //   ).rejects.toThrow(Error);
  // });
});
