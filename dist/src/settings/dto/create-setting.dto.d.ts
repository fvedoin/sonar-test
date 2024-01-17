import { Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
export declare class CreateSettingDto {
    clientId: Types.ObjectId | string | Client;
    offlineTime: number;
    peakHourStart: number;
    peakHourEnd: number;
    precariousVoltageAbove: string;
    precariousVoltageBelow: string;
    criticalVoltageAbove: string;
    criticalVoltageBelow: string;
}
