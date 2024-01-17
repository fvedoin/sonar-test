import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';

export class Job extends AbstractDocument {
  @Prop({ type: Number, required: false })
  interval: number;
  @Prop({ type: String, required: true })
  cmd: string;
  @Prop({ type: String, required: false })
  type: string;

  @Prop({ type: Schema.Types.ObjectId, ref: 'Devices', required: true })
  deviceId: Schema.Types.ObjectId;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;
}

const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.index({ deviceId: 1, cmd: 1 }, { unique: true });

export { JobSchema };
