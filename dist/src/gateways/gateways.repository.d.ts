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
import { Model, Connection, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { Gateway } from './entities/gateway.entity';
export declare class GatewaysRepository extends AbstractRepository<Gateway> {
    private gatewayModel;
    constructor(gatewayModel: Model<Gateway>, connection: Connection);
    findOneAndPopulate(where: any, populate: any): Promise<import("mongoose").Document<unknown, any, Gateway> & Gateway & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findOneAndUpdateWithArgs(conditions: FilterQuery<Gateway>, update: UpdateQuery<Gateway>, options: QueryOptions): Promise<Gateway | null>;
}
