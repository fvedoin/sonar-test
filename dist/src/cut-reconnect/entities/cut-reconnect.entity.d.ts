import mongoose, { Types } from 'mongoose';
import { DeviceGb, DeviceGbDocument } from 'src/devices-gb/entities/devices-gb.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
export declare class CutReconnect extends AbstractDocument {
    type: number;
    tech: string;
    status: string;
    userId: string;
    deviceId: DeviceGbDocument | Types.ObjectId | DeviceGb | string;
}
export declare const CutReconnectSchema: mongoose.Schema<CutReconnect, mongoose.Model<CutReconnect, any, any, any, any>, {}, {}, {}, {}, "type", CutReconnect>;
