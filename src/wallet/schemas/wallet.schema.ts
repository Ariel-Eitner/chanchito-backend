import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
} from 'class-validator';

@Schema()
export class Wallet extends Document {
  @Prop({ required: true })
  @IsString()
  name: string;
  @Prop({ required: true, enum: ['cash', 'bank', 'virtual', 'credit'] })
  @IsEnum(['cash', 'bank', 'virtual', 'credit'])
  type: string;

  @Prop({ default: 0 })
  @IsNumber()
  @IsPositive()
  balanceInCents: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export type WalletDocument = Wallet & Document;
export const WalletSchema = SchemaFactory.createForClass(Wallet);
