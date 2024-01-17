import { Types } from 'mongoose';
export declare class CreateAlertGatewayDto {
    clientId: Types.ObjectId | string;
    emails: string[];
    interval: number;
    status: string;
    ttnId: string;
    enabled: boolean;
}
