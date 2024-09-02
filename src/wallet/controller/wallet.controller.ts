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
  async create(@Body() createWalletDto: CreateWalletDto): Promise<Wallet> {
    return this.walletService.create(createWalletDto);
  }

  @Get()
  async findAllByUser(@Query('userId') userId: string): Promise<Wallet[]> {
    return this.walletService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Wallet> {
    return this.walletService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    return this.walletService.update(id, updateWalletDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.walletService.remove(id);
  }
}
