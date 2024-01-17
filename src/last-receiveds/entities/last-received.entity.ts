import { Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import {
  DeviceGb,
  DeviceGbDocument,
} from 'src/devices-gb/entities/devices-gb.entity';

export class LastReceived extends AbstractDocument {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: DeviceGb.name,
  })
  deviceId: DeviceGbDocument;
  @Prop({ required: true, type: Number })
  port: number;
  @Prop({ required: true, type: Number })
  snr: number;
  @Prop({ required: true, type: Number })
  rssi: number;
  @Prop({ required: true, type: Object })
  package: object;
  @Prop({ required: true, type: Date })
  receivedAt: Date;
}

export const LastReceivedSchema = SchemaFactory.createForClass(LastReceived);
