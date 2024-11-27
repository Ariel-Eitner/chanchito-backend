import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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

import { Subscription } from 'src/suscriptions/schemas/subscription.schema';
import { Transaction } from 'src/transactions/schemas/transaction.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id?: string;
  @Prop({ required: true })
  @IsString()
  @Length(3, 20)
  firstName: string;

  @Prop()
  @IsOptional()
  @IsString()
  @Length(3, 20)
  secondName?: string;

  @Prop()
  @IsOptional()
  @IsString()
  @Length(3, 20)
  lastName?: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsString()
  password: string;

  @Prop({ default: Date.now })
  @IsDate()
  createdAt: Date;

  @Prop({ default: Date.now })
  @IsDate()
  updatedAt: Date;

  @Prop({ type: [Transaction], default: [] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Transaction)
  transactions?: Array<Transaction>;

  @Prop({ type: [String], default: ['user'] })
  @IsOptional()
  @IsEnum(['user', 'admin'], { each: true })
  role?: Array<'user' | 'admin'>;

  @Prop()
  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @Prop()
  @IsOptional()
  @IsDate()
  lastLogin?: Date;

  @Prop({ required: true, default: true })
  @IsBoolean()
  isActive: boolean;

  @Prop({ type: [{ type: 'ObjectId', ref: 'Subscription' }] })
  subscriptions: Subscription[];
}

export const UserSchema = SchemaFactory.createForClass(User);
