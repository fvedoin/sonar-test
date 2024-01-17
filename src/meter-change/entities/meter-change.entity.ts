import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import {
  DeviceGb,
  DeviceGbDocument,
} from 'src/devices-gb/entities/devices-gb.entity';

@Schema()
export class MeterChanges extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Client.name,
    required: true,
  })
  clientId: string | Types.ObjectId | Client;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DeviceGb.name,
    required: true,
    unique: false,
    sparse: false,
  })
  deviceId: DeviceGbDocument | Types.ObjectId | DeviceGb | string;

  @Prop({ required: true })
  ucCode: string;

  @Prop({ required: true })
  firstConsumedNewMeter: number;

  @Prop({ required: true })
  lastConsumedOldMeter: number;

  @Prop({ required: true, default: Date.now })
  changedAt: Date;

  @Prop()
  firstGeneratedNewMeter: number;

  @Prop()
  lastGeneratedOldMeter: number;
}

export const MeterChangeSchema = SchemaFactory.createForClass(MeterChanges);
