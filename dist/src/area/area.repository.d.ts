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
import { Model, Connection, FilterQuery } from 'mongoose';
import { Area } from './entities/area.entity';
export declare class AreaRepository extends AbstractRepository<Area> {
    private areaModel;
    constructor(areaModel: Model<Area>, connection: Connection);
    findAllAndPopulate(populate: string[]): Promise<Omit<import("mongoose").Document<unknown, any, Area> & Area & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>[]>;
    findAndPopulate(where: any, populate: string[]): Promise<Omit<import("mongoose").Document<unknown, any, Area> & Area & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>[]>;
    deleteMany(options: FilterQuery<Area>): Promise<void>;
}
