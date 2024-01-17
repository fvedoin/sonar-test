import mongoose from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
export declare class AlertGateway extends AbstractDocument {
    clientId: Client | mongoose.Types.ObjectId | string;
    emails: string[];
    interval: number;
    status: string;
    ttnId: string;
    enabled: boolean;
}
export declare const AlertGatewaySchema: mongoose.Schema<AlertGateway, mongoose.Model<AlertGateway, any, any, any, any>, {}, {}, {}, {}, "type", AlertGateway>;
