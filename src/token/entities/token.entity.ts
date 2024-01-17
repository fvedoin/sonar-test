import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { AbstractDocument } from 'src/common/database/abstract.schema';
import { User } from 'src/users/entities/user.entity';

@Schema({ collection: 'tokens' })
export class Token extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
    required: true,
  })
  token: string;

  @Prop({ type: Date, required: true, default: Date.now, expires: 60 * 60 })
  createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
