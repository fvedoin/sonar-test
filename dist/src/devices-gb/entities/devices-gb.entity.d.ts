import mongoose, { HydratedDocument, Types } from 'mongoose';
import { ApplicationDocument } from 'src/applications/entities/application.entity';
import { Client } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { InfluxBucket, InfluxBucketDocument } from 'src/influx-buckets/entities/influx-bucket.entity';
export declare type DeviceGbDocument = HydratedDocument<DeviceGb>;
export declare class DeviceGb extends AbstractDocument {
    clientId: Client | mongoose.Types.ObjectId | string;
    applicationId?: ApplicationDocument | Types.ObjectId | string;
    bucketId: InfluxBucketDocument | Types.ObjectId | InfluxBucket | string;
    communication: string;
    type: string;
    devId: string;
    name: string;
    description?: string;
    allows: Array<string>;
}
export declare const DeviceGbSchema: mongoose.Schema<DeviceGb, mongoose.Model<DeviceGb, any, any, any, any>, {}, {}, {}, {}, "type", DeviceGb>;
