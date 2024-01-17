import { Types } from 'mongoose';
import { CreateInfluxBucketDto } from 'src/influx-buckets/dto/create-influx-bucket.dto';
export declare const bucketStub: (id?: Types.ObjectId, bucket?: Partial<CreateInfluxBucketDto>) => {
    name: string;
    alias: string;
    product: string;
    influxConnectionId: string | Types.ObjectId;
    clientId: string | Types.ObjectId;
    _id: Types.ObjectId;
};
export declare const bucketDtoStubs: (dto?: Partial<CreateInfluxBucketDto>) => CreateInfluxBucketDto;
