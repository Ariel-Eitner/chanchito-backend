import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthService } from 'src/auth/service/auth.service';
import { Transaction } from 'src/transactions/schemas/transaction.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from '../../users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;
  let transactionModel: Model<Transaction>;
  // let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('Transaction'),
          useValue: {
            deleteMany: jest.fn(),
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
    transactionModel = module.get<Model<Transaction>>(
      getModelToken('Transaction'),
    );
    // authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
