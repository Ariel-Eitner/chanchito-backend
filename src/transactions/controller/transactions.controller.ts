import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import { Transaction } from '../schemas/transaction.schema';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<{ message: string; transaction: Transaction }> {
    try {
      const transaction =
        await this.transactionsService.create(createTransactionDto);
      return { message: 'Transaction created successfully', transaction };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error.message || 'Error creating transaction',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(): Promise<{ message: string; transactions: Transaction[] }> {
    try {
      const transactions = await this.transactionsService.findAll();
      return { message: 'Transactions retrieved successfully', transactions };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error retrieving transactions',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ message: string; transaction: Transaction }> {
    try {
      const transaction = await this.transactionsService.findOne(id);
      return { message: 'Transaction retrieved successfully', transaction };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error retrieving transaction',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<{ message: string; transaction: Transaction }> {
    try {
      const transaction = await this.transactionsService.update(
        id,
        updateTransactionDto,
      );
      return { message: 'Transaction updated successfully', transaction };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error updating transaction',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ message: string; transaction: Transaction }> {
    try {
      const transaction = await this.transactionsService.remove(id);
      return { message: 'Transaction deleted successfully', transaction };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error deleting transaction',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
