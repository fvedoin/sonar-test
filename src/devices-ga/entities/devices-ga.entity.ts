import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

import { Client } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';

@Schema({ collection: 'devicesga' })
export class DevicesGa extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Client.name,
    required: true,
  })
  clientId: Types.ObjectId | Client;

  @Prop({
    required: false,
    type: Boolean,
    default: false,
  })
  authenticated?: boolean;

  @Prop({
    required: true,
    type: Boolean,
    default: false,
  })
  online?: boolean;

  @Prop({
    required: true,
    unique: true,
  })
  devId: string;

  @Prop({
    required: true,
  })
  provider: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;
}

export const DeviceGaSchema = SchemaFactory.createForClass(DevicesGa);
