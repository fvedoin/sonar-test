import { Types } from 'mongoose';
import { InfluxBucket } from 'src/influx-buckets/entities/influx-bucket.entity';

interface InfluxBucketWithId extends InfluxBucket {
  _id: Types.ObjectId;
}

export const bucketStubs = (
  _id: Types.ObjectId,
): Partial<InfluxBucketWithId> => ({
  _id,
  name: 'fox-iot-telemedicao-b',
});
