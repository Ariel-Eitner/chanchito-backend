import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model, Types } from 'mongoose';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsISO8601,
  Length,
} from 'class-validator';

@Schema()
export class Transaction extends Document {
  @Prop({ required: true })
  @IsISO8601()
  date: string;

  @Prop({ required: true })
  @IsString()
  @Length(1, 255)
  concept: string;

  @Prop({ required: true })
  @IsNumber()
  @IsPositive()
  amountInCents: number;

  @Prop()
  @IsOptional()
  @IsString()
  category?: string;

  @Prop()
  @IsOptional()
  @IsString()
  subcategory?: string;

  @Prop()
  @IsOptional()
  @IsString()
  subsubcategory?: string;

  @Prop({ default: 0 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @Prop({ default: 0 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  unitPrice?: number;

  @Prop()
  @IsOptional()
  @IsString()
  store?: string;

  @Prop()
  @IsOptional()
  @IsString()
  brand?: string;

  @Prop()
  @IsOptional()
  @IsString()
  notes?: string;

  @Prop({ required: true, enum: ['payment', 'income'] })
  @IsEnum(['payment', 'income'])
  type: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
export const TransactionModel = model<Transaction & Document>(
  'Transaction',
  TransactionSchema,
);
