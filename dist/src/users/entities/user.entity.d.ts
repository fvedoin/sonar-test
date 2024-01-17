import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ClientDocument } from 'src/clients/entities/client.entity';
import { AbstractDocument } from 'src/common/database/abstract.schema';
export declare type UserDocument = HydratedDocument<User>;
export declare class User extends AbstractDocument {
    name: string;
    username: string;
    password: string;
    image?: string;
    phone?: string;
    accessLevel: string;
    active?: boolean;
    blocked?: boolean;
    modules: string[];
    clientId: ClientDocument | mongoose.Types.ObjectId | string;
    attempts?: number;
    createdAt?: Date;
    generatedCode?: number;
    codeExpiredAt?: Date;
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, any>, {}, {}, {}, {}, "type", User>;
