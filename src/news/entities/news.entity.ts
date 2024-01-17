import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AbstractDocument } from '../../common/database/abstract.schema';

export type NewsDocument = HydratedDocument<News>;

@Schema()
export class News extends AbstractDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);
