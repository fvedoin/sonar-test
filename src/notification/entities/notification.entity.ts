import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    required: true,
    ref: Client.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  clientId: string;

  @Prop({ required: true, default: Date.now, type: Date })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
