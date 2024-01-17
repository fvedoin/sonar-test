import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ClientDocument } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import {
  InfluxConnection,
  InfluxConnectionDocument,
} from 'src/influx-connections/entities/influx-connection.entity';

export type InfluxBucketDocument = HydratedDocument<InfluxBucket>;

@Schema({ collection: 'buckets' })
export class InfluxBucket extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  alias: string;

  @Prop({ required: true })
  product: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clients',
    required: false,
  })
  clientId: ClientDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: InfluxConnection.name,
    required: false,
  })
  influxConnectionId: InfluxConnectionDocument;
}

export const InfluxBucketSchema = SchemaFactory.createForClass(InfluxBucket);
