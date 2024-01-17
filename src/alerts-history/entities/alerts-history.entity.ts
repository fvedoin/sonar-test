import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';

export type AlertsHistoryDocument = HydratedDocument<AlertHistory>;

@Schema()
export class AlertHistory extends AbstractDocument {
  @Prop()
  alertType: string;

  @Prop()
  alertName: string;

  @Prop()
  alertAllows: string;

  @Prop()
  alertVariables: string;

  @Prop()
  alertValue: string;

  @Prop()
  operator: string;

  @Prop([String])
  sentEmail: string[];

  @Prop()
  alertTime: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Client.name,
  })
  clientId: Client | Types.ObjectId | string;
}

export const AlertsHistorySchema = SchemaFactory.createForClass(AlertHistory);
