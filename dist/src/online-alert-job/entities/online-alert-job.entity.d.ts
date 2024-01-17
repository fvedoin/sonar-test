import mongoose, { Types } from 'mongoose';
import { Alert } from 'src/alert/entities/alert.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { DeviceGb } from 'src/devices-gb/entities/devices-gb.entity';
export declare class OnlineAlertJob extends AbstractDocument {
    triggerAt: Date;
    alertId: Alert | Types.ObjectId | string;
    deviceId: Types.ObjectId | DeviceGb | string;
    createdAt: Date;
}
export declare const OnlineAlertJobSchema: mongoose.Schema<OnlineAlertJob, mongoose.Model<OnlineAlertJob, any, any, any, any>, {}, {}, {}, {}, "type", OnlineAlertJob>;
