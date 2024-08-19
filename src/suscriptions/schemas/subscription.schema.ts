// src/subscription/schemas/subscription.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ required: true, enum: ['active', 'inactive', 'trial'] })
  status: 'active' | 'inactive' | 'trial';

  @Prop({ type: Date })
  startDate?: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ type: Date })
  trialEndDate?: Date;

  @Prop()
  paymentMethod?: string;

  @Prop({ required: true, ref: 'User' })
  userId: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
