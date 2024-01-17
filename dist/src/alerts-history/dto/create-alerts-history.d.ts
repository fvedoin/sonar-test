import { Types } from 'mongoose';
export declare class CreateAlertHistoryDto {
    alertType: string;
    alertName: string;
    alertAllows: string;
    alertVariables: string;
    alertValue: string;
    operator: string;
    sentEmail: string[];
    alertTime: Date;
    clientId: Types.ObjectId | string;
}
