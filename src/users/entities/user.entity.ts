import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ClientDocument } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends AbstractDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  image?: string;

  @Prop()
  phone?: string;

  @Prop({
    type: String,
    required: true,
    enum: ['admin', 'manager', 'support', 'viewer', 'commercial'],
  })
  accessLevel: string;

  @Prop({ default: true })
  active?: boolean;

  @Prop({ default: false })
  blocked?: boolean;

  @Prop({ type: [String], required: true })
  modules: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clients',
    required: true,
  })
  clientId: ClientDocument | mongoose.Types.ObjectId | string;

  @Prop({ default: 0 })
  attempts?: number;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt?: Date;

  @Prop()
  generatedCode?: number;

  @Prop()
  codeExpiredAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
