import { Types } from 'mongoose';
import { CreateInfluxBucketDto } from 'src/influx-buckets/dto/create-influx-bucket.dto';
export declare const bucketStubs: (_id: Types.ObjectId, dto: Partial<CreateInfluxBucketDto>) => {
    name: string;
    alias?: string;
    product?: string;
    influxConnectionId?: string;
    clientId?: string;
    _id: Types.ObjectId;
};
export declare const bucketDtoStubs: (dto?: Partial<CreateInfluxBucketDto>) => CreateInfluxBucketDto;
