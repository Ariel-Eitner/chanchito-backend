import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Transaction } from 'src/transactions/schemas/transaction.schema';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users.service';
import { User, UserDocument } from 'src/users/schemas/user.schema';

describe('UsersService - deleteUserService', () => {
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

  it('should delete a user successfully', async () => {
    const mockUser = { _id: 'user-id', password: 'hashed-password' } as any;

    jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser);
    jest
      .spyOn(transactionModel, 'deleteMany')
      .mockResolvedValue({ deletedCount: 1 } as any);
    // jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(userModel, 'findByIdAndDelete').mockResolvedValue(mockUser);

    await service.deleteUserService('user-id', 'password');

    expect(userModel.findById).toHaveBeenCalledWith('user-id');
    expect(transactionModel.deleteMany).toHaveBeenCalledWith({
      userId: 'user-id',
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
    expect(userModel.findByIdAndDelete).toHaveBeenCalledWith('user-id');
  });

  it('should throw NotFoundException if user is not found', async () => {
    jest.spyOn(userModel, 'findById').mockResolvedValue(null);

    await expect(
      service.deleteUserService('user-id', 'password'),
    ).rejects.toThrow(NotFoundException);
  });

  // it('should throw UnauthorizedException if password is incorrect', async () => {
  //   const mockUser = { _id: 'user-id', password: 'hashed-password' } as any;

  //   jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser);
  //   jest.spyOn(transactionModel, 'deleteMany').mockResolvedValue({ deletedCount: 1 } as any);
  //   jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

  //   await expect(service.deleteUserService('user-id', 'wrong-password')).rejects.toThrow(UnauthorizedException);
  // });
});
