import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users.service';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

describe('UsersService - updateUserService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findByIdAndUpdate: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should update a user and return the updated user', async () => {
    const updateUserDto: UpdateUserDto = { firstName: 'Jane' };
    const mockUser = { _id: 'user-id', ...updateUserDto } as any;

    jest
      .spyOn(userModel, 'findByIdAndUpdate')
      .mockResolvedValue(mockUser as any);

    const result = await service.updateUserService('user-id', updateUserDto);

    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user is not found', async () => {
    jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValue(null);

    await expect(service.updateUserService('user-id', {})).rejects.toThrow(
      NotFoundException,
    );
  });
});
