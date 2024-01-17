import mongoose from 'mongoose';
import { AbstractDocument } from 'src/common/database/abstract.schema';
export declare class Token extends AbstractDocument {
    userId: string;
    token: string;
    createdAt: Date;
}
export declare const TokenSchema: mongoose.Schema<Token, mongoose.Model<Token, any, any, any, any>, {}, {}, {}, {}, "type", Token>;
