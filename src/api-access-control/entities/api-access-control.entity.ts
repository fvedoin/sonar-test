import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ApiAccessControlDocument = HydratedDocument<ApiAccessControl>;

@Schema()
export class ApiAccessControl {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  active: boolean;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  limitRate: number;
}

export const ApiAccessControlSchema =
  SchemaFactory.createForClass(ApiAccessControl);
