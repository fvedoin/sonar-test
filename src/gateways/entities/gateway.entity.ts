import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Client, ClientDocument } from 'src/clients/entities/client.entity';
import { Point } from '../models/PointSchema';
import { PointSchema } from '../utils/PointSchema';
import { AbstractDocument } from 'src/common/database/abstract.schema';

export type GatewayDocument = HydratedDocument<Gateway>;

@Schema()
export class Gateway extends AbstractDocument {
  @Prop({ required: true, unique: true })
  ttnId: string;

  @Prop({ default: false })
  online: boolean;

  @Prop({ required: false })
  lastChecked: Date;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: Client.name,
    required: false,
  })
  clientId: ClientDocument[];

  @Prop({ type: PointSchema, index: '2dsphere', required: false })
  location: Point;
}

export const GatewaySchema = SchemaFactory.createForClass(Gateway);
