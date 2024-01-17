import { Types } from 'mongoose';
import { CreateInfluxBucketDto } from 'src/influx-buckets/dto/create-influx-bucket.dto';
import { InfluxBucket } from 'src/influx-buckets/entities/influx-bucket.entity';

interface InfluxBucketWithId extends InfluxBucket {
  _id: Types.ObjectId;
}

export const bucketStubs = (
  _id: Types.ObjectId,
  dto: Partial<CreateInfluxBucketDto>,
) => ({
  _id,
  name: 'fox-iot-telemedicao-b',
  ...dto,
});

export const bucketDtoStubs = (
  dto?: Partial<CreateInfluxBucketDto>,
): CreateInfluxBucketDto => {
  return {
    name: 'fox-iot-telemedicao-b',
    influxConnectionId: new Types.ObjectId().toString(),
    clientId: new Types.ObjectId().toString(),
    alias: 'Bucket Smart Trafo',
    product: 'smart-trafo',
    ...dto,
  };
};
