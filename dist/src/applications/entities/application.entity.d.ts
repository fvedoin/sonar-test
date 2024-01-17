import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ClientDocument } from 'src/clients/entities/client.entity';
export declare type ApplicationDocument = HydratedDocument<Application>;
export declare class Application {
    appId: string;
    token: string;
    name: string;
    description: string;
    clientId: ClientDocument;
}
export declare const ApplicationSchema: mongoose.Schema<Application, mongoose.Model<Application, any, any, any, any>, {}, {}, {}, {}, "type", Application>;
