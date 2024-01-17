import mongoose from 'mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';
export declare class Alert extends AbstractDocument {
    time: number;
    enabled: boolean;
    emails: [string];
    interval: string;
    allows: string;
    variable: string;
    operator: string;
    communication: string;
    type: string;
    value: string;
    groupId: mongoose.Schema.Types.ObjectId;
    deviceId: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
}
declare const AlertSchema: mongoose.Schema<Alert, mongoose.Model<Alert, any, any, any, any>, {}, {}, {}, {}, "type", Alert>;
export { AlertSchema };
