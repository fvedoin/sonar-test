import mongoose, { Types } from 'mongoose';
import { Alert } from 'src/alert/entities/alert.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { DeviceGb, DeviceGbDocument } from 'src/devices-gb/entities/devices-gb.entity';
export declare class OfflineAlertJob extends AbstractDocument {
    triggerAt: Date;
    alertId: Alert | Types.ObjectId | string;
    deviceId: DeviceGbDocument | Types.ObjectId | DeviceGb | string;
    createdAt: Date;
}
export declare const OfflineAlertJobSchema: mongoose.Schema<OfflineAlertJob, mongoose.Model<OfflineAlertJob, any, any, any, any>, {}, {}, {}, {}, "type", OfflineAlertJob>;
