// mqttApplicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'BrokerAttributes', required: false },

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Application } from 'src/applications/entities/application.entity';
import { Client } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { InfluxBucket } from 'src/influx-buckets/entities/influx-bucket.entity';
import { MqttAccess } from 'src/mqtt-access/entities/mqtt-access.entity';

export type DeviceTrDocument = HydratedDocument<DeviceTr>;

@Schema({ collection: 'smarttrafodevices' })
export class DeviceTr extends AbstractDocument {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'Client',
  })
  clientId: Client | mongoose.Types.ObjectId | string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applications',
  })
  applicationId: Application | mongoose.Types.ObjectId | string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MqttAccesses',
  })
  mqttApplicationId: MqttAccess | mongoose.Types.ObjectId | string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buckets',
  })
  bucketId: InfluxBucket | mongoose.Types.ObjectId | string;

  @Prop({
    required: true,
    enum: ['Telik Trafo', 'Telik Trafo Lite', 'Smart Trafo'],
  })
  type: string;

  @Prop({
    required: true,
    unique: true,
  })
  devId: string;

  @Prop({ required: true })
  name: string;
}

export const DeviceTrSchema = SchemaFactory.createForClass(DeviceTr);
