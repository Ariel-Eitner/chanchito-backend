import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  balanceInCents?: number;
}
