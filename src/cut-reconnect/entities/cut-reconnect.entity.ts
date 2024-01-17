import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import {
  DeviceGb,
  DeviceGbDocument,
} from 'src/devices-gb/entities/devices-gb.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class CutReconnect extends AbstractDocument {
  @Prop({
    type: Number,
    required: true,
  })
  type: number;
  @Prop({
    type: String,
    enum: ['LoRa', 'GSM'],
  })
  tech: string;
  @Prop({
    type: String,
    required: true,
  })
  status: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Client.name,
    required: true,
  })
  userId: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DeviceGb.name,
    required: true,
  })
  deviceId: DeviceGbDocument | Types.ObjectId | DeviceGb | string;
}

export const CutReconnectSchema = SchemaFactory.createForClass(CutReconnect);
