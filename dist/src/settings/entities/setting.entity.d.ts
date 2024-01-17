import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
export declare type SettingDocument = HydratedDocument<Setting>;
export declare class Setting extends AbstractDocument {
    clientId: Client | Types.ObjectId | string;
    offlineTime: number;
    peakHourStart: number;
    peakHourEnd: number;
    precariousVoltageAbove: string;
    precariousVoltageBelow: string;
    criticalVoltageAbove: string;
    criticalVoltageBelow: string;
}
export declare const SettingSchema: mongoose.Schema<Setting, mongoose.Model<Setting, any, any, any, any>, {}, {}, {}, {}, "type", Setting>;
