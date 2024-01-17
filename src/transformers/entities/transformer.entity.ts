import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import { Point } from '../models/PointSchema';
import { PointSchema } from '../utils/PointSchema';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { DeviceTr } from 'src/devices-tr/entities/devices-tr.entity';

export type TransformerDocument = HydratedDocument<Transformer>;

@Schema()
export class Transformer extends AbstractDocument {
  @Prop({ required: true, unique: true })
  it: string;

  @Prop({ required: true })
  serieNumber: string;

  @Prop({ type: Number, enum: [1, 2, 3, 4, 5], required: true })
  tapLevel: number;

  @Prop({ required: true })
  tap: number;

  @Prop({ required: true })
  feeder: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  loadLimit: number;

  @Prop({ required: true })
  overloadTimeLimit: number;

  @Prop({ required: true })
  nominalValue_i: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Client.name,
  })
  clientId: Client | Types.ObjectId | string;

  @Prop({ type: PointSchema, index: '2dsphere', required: false })
  location: Point;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: DeviceTr.name,
  })
  smartTrafoDeviceId?: DeviceTr | Types.ObjectId | string;
}

export const TransformerSchema = SchemaFactory.createForClass(Transformer);
