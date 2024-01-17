import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
export declare type AlertsHistoryDocument = HydratedDocument<AlertHistory>;
export declare class AlertHistory extends AbstractDocument {
    alertType: string;
    alertName: string;
    alertAllows: string;
    alertVariables: string;
    alertValue: string;
    operator: string;
    sentEmail: string[];
    alertTime: Date;
    clientId: Client | Types.ObjectId | string;
}
export declare const AlertsHistorySchema: mongoose.Schema<AlertHistory, mongoose.Model<AlertHistory, any, any, any, any>, {}, {}, {}, {}, "type", AlertHistory>;
