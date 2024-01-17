import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';

export type InfluxConnectionDocument = HydratedDocument<InfluxConnection>;

@Schema()
export class InfluxConnection extends AbstractDocument {
  @Prop({ required: true })
  alias: string;

  @Prop({ required: true })
  host: string;

  @Prop({ required: true })
  apiToken: string;

  @Prop({ required: true })
  orgId: string;
}

export const InfluxConnectionSchema =
  SchemaFactory.createForClass(InfluxConnection);
