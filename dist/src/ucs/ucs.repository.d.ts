/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { AbstractRepository } from '../common/database/abstract.repository';
import { Model, Connection, FilterQuery, Types, ProjectionFields } from 'mongoose';
import { Uc } from './entities/uc.entity';
import { DeviceGbDocument } from 'src/devices-gb/entities/devices-gb.entity';
declare type UCPopulate = Uc & {
    deviceId: DeviceGbDocument & {
        clientId: string;
        bucketId: string;
    };
};
export declare class UcsRepository extends AbstractRepository<Uc> {
    private ucModel;
    constructor(ucModel: Model<Uc>, connection: Connection);
    findWithPopulate(query: FilterQuery<Uc>, projection?: ProjectionFields<Uc>): Promise<UCPopulate[]>;
    findWherePopulate(whereClause: FilterQuery<Uc>, populate: string[]): Promise<Omit<import("mongoose").Document<unknown, any, Uc> & Uc & Required<{
        _id: Types.ObjectId;
    }>, never>[]>;
    findByIdAndUpdate(id: any, uc: any, session?: any): Promise<import("mongoose").Document<unknown, any, Uc> & Uc & Required<{
        _id: Types.ObjectId;
    }>>;
    findWithOnePopulate(query: FilterQuery<Uc>, projection?: ProjectionFields<Uc>): Promise<any>;
    findByIdWithPopulate(filterQuery: FilterQuery<Uc>, populate: string[]): Promise<import("mongoose").Document<unknown, any, Uc> & Uc & Required<{
        _id: Types.ObjectId;
    }>>;
    findAndPopulate(filterQuery: FilterQuery<Uc>, populate: string[]): Promise<Omit<import("mongoose").Document<unknown, any, Uc> & Uc & Required<{
        _id: Types.ObjectId;
    }>, never>[]>;
    countByDeviceId(deviceId: string | Types.ObjectId): Promise<number>;
    countByUcByDeviceId(deviceId: string, id: string): Promise<number>;
    deleteMany(ids: string[]): Promise<void>;
    updateDeviceId(oldDeviceId: any, newDeviceId: any, session: any): Promise<import("mongodb").UpdateResult>;
    findPaginated(where: any, data: any): Promise<{
        data: any;
        pageInfo: any;
    }>;
}
export {};
