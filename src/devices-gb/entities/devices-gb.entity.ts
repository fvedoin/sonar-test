//     brokerAttributeId: { type: mongoose.Schema.Types.ObjectId, ref: 'BrokerAttributes', required: false }, //gsm
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import {
  Application,
  ApplicationDocument,
} from 'src/applications/entities/application.entity';
import { Client, ClientDocument } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import {
  InfluxBucket,
  InfluxBucketDocument,
} from 'src/influx-buckets/entities/influx-bucket.entity';

export type DeviceGbDocument = HydratedDocument<DeviceGb>;

@Schema({ collection: 'devices' })
export class DeviceGb extends AbstractDocument {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'Client',
  })
  clientId: Client | mongoose.Types.ObjectId | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Application.name,
    required: false,
  })
  applicationId?: ApplicationDocument | Types.ObjectId | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: InfluxBucket.name,
    required: true,
  })
  bucketId: InfluxBucketDocument | Types.ObjectId | InfluxBucket | string;

  @Prop({
    required: true,
    enum: ['PIMA', 'ABNT NBR 14522', 'Saída de usuário', 'DLMS'],
  })
  communication: string;

  @Prop({
    required: true,
    enum: ['LoRa', 'GSM'],
  })
  type: string;

  @Prop({
    required: true,
    unique: true,
  })
  devId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  allows: Array<string>;
}

export const DeviceGbSchema = SchemaFactory.createForClass(DeviceGb);
