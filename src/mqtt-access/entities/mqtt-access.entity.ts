import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MqttAccessDocument = HydratedDocument<MqttAccess>;

@Schema()
export class MqttAccess {
  @Prop({ required: true })
  username: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false, unique: true, sparse: true })
  devId: string;

  @Prop({ required: true, default: false })
  isSuperUser: boolean;

  @Prop({ required: true })
  encryptedPassword: string;

  @Prop({ required: true, default: 'allow' })
  permission: string;

  @Prop({ required: true, default: 'all' })
  action: string;

  @Prop({ required: true })
  topics: string[];

  @Prop({ default: false })
  online: boolean;

  @Prop({ required: true, enum: ['client', 'application'] })
  type: string;
}

export const MqttAccessSchema = SchemaFactory.createForClass(MqttAccess);
