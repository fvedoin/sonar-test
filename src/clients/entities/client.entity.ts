import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop()
  initials: string;

  @Prop({ required: true })
  cnpj: string;

  @Prop({ required: false })
  aneelcode?: string;

  @Prop({ required: true })
  local: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: false, default: true })
  active?: boolean;

  @Prop({ type: [String], required: true })
  modules: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Client.name,
    required: false,
  })
  parentId?: ClientDocument | Types.ObjectId | string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
