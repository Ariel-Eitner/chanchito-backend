import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument } from '../schemas/wallet.schema';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  async createWalletService(createWalletDto: CreateWalletDto): Promise<Wallet> {
    const { userId, ...rest } = createWalletDto;

    const newWallet = new this.walletModel({
      ...rest,
      userId: new Types.ObjectId(userId),
    });

    return newWallet.save();
  }

  async findAllWalletsByUserService(userId: string): Promise<Wallet[]> {
    return this.walletModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findOneWalletService(id: string): Promise<Wallet> {
    const wallet = await this.walletModel.findById(id).exec();
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID "${id}" not found`);
    }
    return wallet;
  }

  async updateWalletService(
    id: string,
    updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    const updatedWallet = await this.walletModel
      .findByIdAndUpdate(id, updateWalletDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedWallet) {
      throw new NotFoundException(`Wallet with ID "${id}" not found`);
    }
    return updatedWallet;
  }

  async deleteWalletService(id: string): Promise<void> {
    const result = await this.walletModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Wallet with ID "${id}" not found`);
    }
  }
}
