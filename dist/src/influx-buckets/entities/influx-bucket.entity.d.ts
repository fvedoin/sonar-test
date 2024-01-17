import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ClientDocument } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { InfluxConnectionDocument } from 'src/influx-connections/entities/influx-connection.entity';
export declare type InfluxBucketDocument = HydratedDocument<InfluxBucket>;
export declare class InfluxBucket extends AbstractDocument {
    name: string;
    alias: string;
    product: string;
    clientId: ClientDocument;
    influxConnectionId: InfluxConnectionDocument;
}
export declare const InfluxBucketSchema: mongoose.Schema<InfluxBucket, mongoose.Model<InfluxBucket, any, any, any, any>, {}, {}, {}, {}, "type", InfluxBucket>;
