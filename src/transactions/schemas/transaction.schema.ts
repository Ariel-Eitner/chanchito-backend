import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transaction extends Document {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  concept: string;

  @Prop({ required: true })
  amountInCents: number;

  @Prop()
  category?: string;

  @Prop()
  subcategory?: string;

  @Prop()
  subsubcategory?: string;

  @Prop({ default: 0 })
  quantity?: number;

  @Prop({ default: 0 })
  unitPrice?: number;

  @Prop()
  store?: string;

  @Prop()
  brand?: string;

  @Prop()
  notes?: string;

  @Prop({ required: true, enum: ['payment', 'income'] })
  type: string;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
