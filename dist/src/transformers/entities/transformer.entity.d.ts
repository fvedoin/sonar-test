import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import { Point } from '../models/PointSchema';
import { AbstractDocument } from 'src/common/database/abstract.schema';
import { DeviceTr } from 'src/devices-tr/entities/devices-tr.entity';
export declare type TransformerDocument = HydratedDocument<Transformer>;
export declare class Transformer extends AbstractDocument {
    it: string;
    serieNumber: string;
    tapLevel: number;
    tap: number;
    feeder: string;
    city: string;
    loadLimit: number;
    overloadTimeLimit: number;
    nominalValue_i: number;
    clientId: Client | Types.ObjectId | string;
    location: Point;
    smartTrafoDeviceId?: DeviceTr | Types.ObjectId | string;
}
export declare const TransformerSchema: mongoose.Schema<Transformer, mongoose.Model<Transformer, any, any, any, any>, {}, {}, {}, {}, "type", Transformer>;
