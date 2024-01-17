import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';

@Schema()
export class Alert extends AbstractDocument {
  @Prop({ type: Number, required: false })
  time: number;

  @Prop({ type: Boolean, required: true, default: true })
  enabled: boolean;

  @Prop({ type: [String], required: true })
  emails: [string];

  @Prop({ type: String, required: false })
  interval: string;

  @Prop({ type: String, required: true })
  allows: string;

  @Prop({ type: String, required: true })
  variable: string;

  @Prop({ type: String, required: true })
  operator: string;

  @Prop({ type: String, required: false })
  communication: string;

  @Prop({ type: String, required: false })
  type: string;

  @Prop({ type: String, required: false })
  value: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AlertGroups',
    required: false,
  })
  groupId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Devices',
    required: true,
  })
  deviceId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;
}

const AlertSchema = SchemaFactory.createForClass(Alert);

AlertSchema.index(
  { deviceId: 1, variable: 1, operator: 1, value: 1, time: 1, interval: 1 },
  { unique: true },
);

export { AlertSchema };
