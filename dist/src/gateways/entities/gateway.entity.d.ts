import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ClientDocument } from 'src/clients/entities/client.entity';
import { Point } from '../models/PointSchema';
import { AbstractDocument } from 'src/common/database/abstract.schema';
export declare type GatewayDocument = HydratedDocument<Gateway>;
export declare class Gateway extends AbstractDocument {
    ttnId: string;
    online: boolean;
    lastChecked: Date;
    clientId: ClientDocument[];
    location: Point;
}
export declare const GatewaySchema: mongoose.Schema<Gateway, mongoose.Model<Gateway, any, any, any, any>, {}, {}, {}, {}, "type", Gateway>;
