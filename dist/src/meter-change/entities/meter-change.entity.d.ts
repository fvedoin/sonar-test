import mongoose, { Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { DeviceGb, DeviceGbDocument } from 'src/devices-gb/entities/devices-gb.entity';
export declare class MeterChanges extends AbstractDocument {
    clientId: string | Types.ObjectId | Client;
    deviceId: DeviceGbDocument | Types.ObjectId | DeviceGb | string;
    ucCode: string;
    firstConsumedNewMeter: number;
    lastConsumedOldMeter: number;
    changedAt: Date;
    firstGeneratedNewMeter: number;
    lastGeneratedOldMeter: number;
}
export declare const MeterChangeSchema: mongoose.Schema<MeterChanges, mongoose.Model<MeterChanges, any, any, any, any>, {}, {}, {}, {}, "type", MeterChanges>;
