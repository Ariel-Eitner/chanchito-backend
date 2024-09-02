import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Transaction,
  TransactionDocument,
} from '../schemas/transaction.schema';

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const createdTransaction = new this.transactionModel(createTransactionDto);
    return createdTransaction.save();
  }

  async findAll(userId: string): Promise<Transaction[]> {
    return this.transactionModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    Logger.log(`User ID: ${userId}`, 'TransactionService');
    return this.transactionModel.findOne({ _id: id, userId }).exec();
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ): Promise<Transaction> {
    return this.transactionModel
      .findOneAndUpdate({ _id: id, userId }, updateTransactionDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string, userId: string): Promise<Transaction> {
    return this.transactionModel.findOneAndDelete({ _id: id, userId }).exec();
  }
}
