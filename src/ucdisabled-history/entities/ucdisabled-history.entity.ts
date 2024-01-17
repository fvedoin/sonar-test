import { Client } from 'src/clients/entities/client.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { Uc } from 'src/ucs/entities/uc.entity';
import { DeviceGb } from 'src/devices-gb/entities/devices-gb.entity';
import { User } from 'src/users/entities/user.entity';

export type UcdisabledHistoryDocument = HydratedDocument<UcdisabledHistory>;

@Schema()
export class UcdisabledHistory extends AbstractDocument {
  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'Client',
  })
  clientId: Types.ObjectId | Client;

  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'Uc',
  })
  ucId: Types.ObjectId | Uc;

  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'devices',
  })
  deviceId: Types.ObjectId | DeviceGb;

  @Prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'users',
  })
  userId: Types.ObjectId | User;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ required: true })
  dataDeleted: boolean;
}

export const UcdisabledHistorySchema =
  SchemaFactory.createForClass(UcdisabledHistory);
