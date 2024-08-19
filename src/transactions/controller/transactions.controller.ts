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

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string; transaction: Transaction }> {
    try {
      const userId = req.user.userId; // Obtener el ID del usuario desde la solicitud
      const transactionData = {
        ...createTransactionDto,
        userId, // Incluir el ID del usuario en los datos de la transacción
      };

      const transaction =
        await this.transactionsService.create(transactionData);
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
  async findAll(
    @Req() req: any,
  ): Promise<{ message: string; transactions: Transaction[] }> {
    try {
      console.log(req.user);
      const userId = req.user.userId; // Obtener el ID del usuario desde la solicitud
      const transactions = await this.transactionsService.findAll(userId); // Pasar el userId al servicio
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
    @Req() req: any,
  ): Promise<{ message: string; transaction: Transaction }> {
    try {
      const userId = req.user.userId; // Obtener el ID del usuario desde la solicitud
      const transaction = await this.transactionsService.findOne(id, userId); // Pasar el userId al servicio
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
    @Req() req: any,
  ): Promise<{ message: string; transaction: Transaction }> {
    try {
      const userId = req.user.userId; // Obtener el ID del usuario desde la solicitud
      const transaction = await this.transactionsService.update(
        id,
        updateTransactionDto,
        userId, // Pasar el userId al servicio
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
    @Req() req: any,
  ): Promise<{ message: string; transaction: Transaction }> {
    try {
      const userId = req.user.userId; // Obtener el ID del usuario desde la solicitud
      const transaction = await this.transactionsService.remove(id, userId); // Pasar el userId al servicio
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
