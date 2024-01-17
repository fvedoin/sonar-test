import { Types } from 'mongoose';
import { InfluxBucket } from 'src/influx-buckets/entities/influx-bucket.entity';
interface InfluxBucketWithId extends InfluxBucket {
    _id: Types.ObjectId;
}
export declare const bucketStubs: (_id: Types.ObjectId) => Partial<InfluxBucketWithId>;
export {};
