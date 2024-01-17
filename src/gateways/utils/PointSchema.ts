import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Point {
  @Prop({ enum: ['Point'], required: true })
  type: string;

  @Prop({ required: true })
  coordinates: [number];
}

export const PointSchema = SchemaFactory.createForClass(Point);
