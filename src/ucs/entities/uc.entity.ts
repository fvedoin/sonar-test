import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import {
  DeviceGb,
  DeviceGbDocument,
} from 'src/devices-gb/entities/devices-gb.entity';
import { LastReceived } from 'src/last-receiveds/entities/last-received.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { Transformer } from 'src/transformers/entities/transformer.entity';

import { Point } from '../models/PointSchema';
import { PointSchema } from '../utils/PointSchema';
import { AbstractDocument } from 'src/common/database/abstract.schema';

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Uc extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Client.name,
    required: true,
  })
  clientId: string | Types.ObjectId | Client;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Transformer.name,
    required: true,
  })
  transformerId: Types.ObjectId | Transformer | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DeviceGb.name,
    required: false,
    unique: true,
    sparse: true,
  })
  deviceId: DeviceGbDocument | Types.ObjectId | DeviceGb | string;

  @Prop({ required: true })
  routeCode: number;

  @Prop({ required: true, unique: true })
  ucCode: string;

  @Prop({ required: true })
  ucNumber: string;

  @Prop({ required: true })
  ucClass: string;

  @Prop({ required: false })
  subClass: string;

  @Prop({ required: true })
  billingGroup: number;

  @Prop({ required: true, default: 220 })
  ratedVoltage: number;

  @Prop({ required: true })
  group: string;

  @Prop({ required: false })
  subGroup: string;

  @Prop({ required: true })
  sequence: string;

  @Prop({
    type: String,
    enum: ['A', 'B', 'C', 'AB', 'AC', 'BC', 'ABC'],
    required: true,
  })
  phases: string;

  @Prop({ required: true })
  circuitBreaker: number;

  @Prop({ required: true })
  microgeneration: boolean;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: false, default: false })
  isCutted: boolean;

  @Prop({ required: true })
  timeZone: string;

  @Prop({ type: PointSchema, index: '2dsphere', required: false })
  location: Point;
}

export const UcSchema = SchemaFactory.createForClass(Uc);

UcSchema.virtual('lastReceived', {
  ref: LastReceived.name,
  foreignField: 'deviceId',
  localField: 'deviceId',
});

UcSchema.virtual('settings', {
  ref: Setting.name,
  foreignField: 'clientId',
  localField: 'clientId',
});
