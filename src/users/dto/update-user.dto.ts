import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction } from 'src/transactions/schemas/transaction.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 20)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(3, 20)
  secondName?: string;

  @IsOptional()
  @IsString()
  @Length(3, 20)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Transaction)
  transactions?: Array<Transaction>;

  @IsOptional()
  @IsEnum(['user', 'admin'], { each: true })
  role?: Array<'user' | 'admin'>;

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastLogin?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}