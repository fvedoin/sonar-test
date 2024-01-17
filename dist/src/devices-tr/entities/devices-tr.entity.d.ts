import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Application } from 'src/applications/entities/application.entity';
import { Client } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { InfluxBucket } from 'src/influx-buckets/entities/influx-bucket.entity';
import { MqttAccess } from 'src/mqtt-access/entities/mqtt-access.entity';
export declare type DeviceTrDocument = HydratedDocument<DeviceTr>;
export declare class DeviceTr extends AbstractDocument {
    clientId: Client | mongoose.Types.ObjectId | string;
    applicationId: Application | mongoose.Types.ObjectId | string;
    mqttApplicationId: MqttAccess | mongoose.Types.ObjectId | string;
    bucketId: InfluxBucket | mongoose.Types.ObjectId | string;
    type: string;
    devId: string;
    name: string;
}
export declare const DeviceTrSchema: mongoose.Schema<DeviceTr, mongoose.Model<DeviceTr, any, any, any, any>, {}, {}, {}, {}, "type", DeviceTr>;
