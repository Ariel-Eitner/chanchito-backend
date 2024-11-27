import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from '../service/wallet.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { Wallet } from '../schemas/wallet.schema';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import {
  AuthenticatedRequest,
  JwtAuthGuard,
} from 'src/auth/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async createWalletController(
    @Body() createWalletDto: CreateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.createWalletService(createWalletDto);
  }

  @Get()
  async findAllWalletsByUserController(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string; wallets: Wallet[] }> {
    const userId = req.user.sub;
    try {
      // Espera a que la promesa se resuelva y obtén las wallets
      const wallets =
        await this.walletService.findAllWalletsByUserService(userId);
      return { message: 'Wallets retrieved successfully', wallets };
    } catch (error) {
      // Maneja el error de manera adecuada
      console.error('Error retrieving wallets:', error);
      throw new Error('Error retrieving wallets');
    }
  }

  @Get(':id')
  async findOneWalletController(@Param('id') id: string): Promise<Wallet> {
    return this.walletService.findOneWalletService(id);
  }

  @Patch(':id')
  async updateWalletController(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.updateWalletService(id, updateWalletDto);
  }

  @Delete(':id')
  async deleteWalletController(@Param('id') id: string): Promise<void> {
    return this.walletService.deleteWalletService(id);
  }
}
