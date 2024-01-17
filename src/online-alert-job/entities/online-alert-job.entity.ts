import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Alert } from 'src/alert/entities/alert.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { DeviceGb } from 'src/devices-gb/entities/devices-gb.entity';

@Schema({ collection: 'onlinealertjobs' })
export class OnlineAlertJob extends AbstractDocument {
  @Prop({ required: true })
  triggerAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Alert.name,
    required: true,
  })
  alertId: Alert | Types.ObjectId | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: DeviceGb.name,
    required: true,
    unique: true,
  })
  deviceId: Types.ObjectId | DeviceGb | string;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;
}

export const OnlineAlertJobSchema =
  SchemaFactory.createForClass(OnlineAlertJob);
