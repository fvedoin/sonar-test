import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';

export type SettingDocument = HydratedDocument<Setting>;

@Schema()
export class Setting extends AbstractDocument {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Client.name,
  })
  clientId: Client | Types.ObjectId | string;

  @Prop({ required: true })
  offlineTime: number;

  @Prop({ required: true })
  peakHourStart: number;

  @Prop({ required: true })
  peakHourEnd: number;

  @Prop({ required: true })
  precariousVoltageAbove: string;

  @Prop({ required: true })
  precariousVoltageBelow: string;

  @Prop({ required: true })
  criticalVoltageAbove: string;

  @Prop({ required: true })
  criticalVoltageBelow: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
