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
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransactionsService } from '../service/transactions.service';
import { Transaction } from '../schemas/transaction.schema';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTransactionController(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string; transaction: Transaction }> {
    try {
      const userId = req.user.sub;
      const transactionData = {
        ...createTransactionDto,
        userId,
      };

      const transaction =
        await this.transactionsService.createTransactionService(
          transactionData,
        );
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
  async findAllUserTransactionsController(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string; transactions: Transaction[] }> {
    try {
      const userId = req.user.sub;
      const transactions =
        await this.transactionsService.findAllUserTransactionsService(userId);
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
  async findOneTransactionController(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<{ message: string; transaction: Transaction }> {
    try {
      const userId = req.user.sub;
      const transaction =
        await this.transactionsService.findOneTransactionService(id, userId);
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
  async updateTransactionController(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req: any,
  ): Promise<{ message: string; transaction: Transaction }> {
    try {
      const userId = req.user.sub;
      const transaction =
        await this.transactionsService.updateTransactionService(
          id,
          updateTransactionDto,
          userId,
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
  async deleteTransactionController(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<{ message: string; transaction: Transaction }> {
    try {
      const userId = req.user.sub;
      const transaction =
        await this.transactionsService.deleteTransactionService(id, userId);
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
