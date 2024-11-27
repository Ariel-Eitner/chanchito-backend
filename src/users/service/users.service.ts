import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthService } from 'src/auth/service/auth.service';
import * as bcrypt from 'bcrypt';
import { Transaction } from 'src/transactions/schemas/transaction.schema';

export interface UserWithToken {
  user: User;
  token: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel('Transaction')
    private readonly transactionModel: Model<Transaction>,
    private readonly authService: AuthService,
  ) {}

  async createUserService(
    createUserDto: CreateUserDto,
  ): Promise<UserWithToken> {
    const existingUser = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const user = await createdUser.save();

    const userId = String(user._id);
    const token = this.authService.generateJwtService(userId);
    return { user, token };
  }

  async fetchUserByIdService(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async updateUserService(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return updatedUser;
  }

  async deleteUserService(id: string, password: string): Promise<void> {
    // Encuentra al usuario por ID
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.transactionModel.deleteMany({ userId: id }).exec();

    // Verifica la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    // Si la contraseña es correcta, elimina al usuario
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  async findUserByEmailService(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUserPasswordService(
    user: User,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
