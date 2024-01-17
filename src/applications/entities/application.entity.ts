import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ClientDocument } from 'src/clients/entities/client.entity';

export type ApplicationDocument = HydratedDocument<Application>;

@Schema()
export class Application {
  @Prop({ required: true, unique: true })
  appId: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clients',
    required: true,
  })
  clientId: ClientDocument;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
