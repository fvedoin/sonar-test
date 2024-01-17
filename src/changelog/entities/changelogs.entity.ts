import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';

@Schema()
export class Changelog extends AbstractDocument {
  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: Date.now })
  date?: Date;
}

export const ChangelogSchema = SchemaFactory.createForClass(Changelog);
