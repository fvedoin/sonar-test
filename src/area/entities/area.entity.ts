import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PointSchema } from '../schema/PointSchema';
import { Client } from '../../clients/entities/client.entity';
import { AbstractDocument } from '../../common/database/abstract.schema';

export interface Point {
  type: string;
  coordinates: number[];
}

@Schema()
export class Area extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Client',
  })
  clientId: Client | Types.ObjectId | string;

  @Prop({ required: true, type: [PointSchema] })
  points: Point[];
}

export const AreaSchema = SchemaFactory.createForClass(Area);
