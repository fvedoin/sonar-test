import mongoose, { HydratedDocument, Types } from 'mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';
export declare type ClientDocument = HydratedDocument<Client>;
export declare class Client extends AbstractDocument {
    name: string;
    initials: string;
    cnpj: string;
    aneelcode?: string;
    local: string;
    address: string;
    active?: boolean;
    modules: string[];
    parentId?: ClientDocument | Types.ObjectId | string;
}
export declare const ClientSchema: mongoose.Schema<Client, mongoose.Model<Client, any, any, any, any>, {}, {}, {}, {}, "type", Client>;
