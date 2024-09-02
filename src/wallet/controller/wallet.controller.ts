import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { WalletService } from '../service/wallet.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { Wallet } from '../schemas/wallet.schema';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

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
    @Query('userId') userId: string,
  ): Promise<Wallet[]> {
    return this.walletService.findAllWalletsByUserService(userId);
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
