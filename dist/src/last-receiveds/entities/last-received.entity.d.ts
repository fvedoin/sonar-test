import * as mongoose from 'mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { DeviceGbDocument } from 'src/devices-gb/entities/devices-gb.entity';
export declare class LastReceived extends AbstractDocument {
    deviceId: DeviceGbDocument;
    port: number;
    snr: number;
    rssi: number;
    package: object;
    receivedAt: Date;
}
export declare const LastReceivedSchema: mongoose.Schema<LastReceived, mongoose.Model<LastReceived, any, any, any, any>, {}, {}, {}, {}, "type", LastReceived>;
