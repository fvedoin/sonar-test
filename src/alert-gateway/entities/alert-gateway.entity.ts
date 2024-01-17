import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';

export class AlertGateway extends AbstractDocument {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'Client',
  })
  clientId: Client | mongoose.Types.ObjectId | string;

  @Prop({ type: [String], required: true })
  emails: string[];

  @Prop({ type: Number, required: true })
  interval: number;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: String, required: true })
  ttnId: string;

  @Prop({ type: Boolean, required: true, default: true })
  enabled: boolean;
}

export const AlertGatewaySchema = SchemaFactory.createForClass(AlertGateway);
