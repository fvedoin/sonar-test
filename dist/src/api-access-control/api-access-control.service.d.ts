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
import { Model } from 'mongoose';
import { CreateApiAccessControlDto } from './dto/create-api-access-control.dto';
import { UpdateApiAccessControlDto } from './dto/update-api-access-control.dto';
import { ApiAccessControl, ApiAccessControlDocument } from './entities/api-access-control.entity';
export declare class ApiAccessControlService {
    private apiAccessControlModel;
    constructor(apiAccessControlModel: Model<ApiAccessControlDocument>);
    create(createApiAccessControlDto: CreateApiAccessControlDto): Promise<import("mongoose").Document<unknown, any, ApiAccessControl> & ApiAccessControl & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): import("mongoose").Query<(import("mongoose").Document<unknown, any, ApiAccessControl> & ApiAccessControl & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, any, ApiAccessControl> & ApiAccessControl & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, ApiAccessControl> & ApiAccessControl & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOne(id: string): import("mongoose").Query<import("mongoose").Document<unknown, any, ApiAccessControl> & ApiAccessControl & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, ApiAccessControl> & ApiAccessControl & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, ApiAccessControl> & ApiAccessControl & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, updateApiAccessControlDto: UpdateApiAccessControlDto): import("mongoose").Query<import("mongoose").Document<unknown, any, ApiAccessControl> & ApiAccessControl & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, ApiAccessControl> & ApiAccessControl & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, ApiAccessControl> & ApiAccessControl & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: string): Promise<import("mongodb").DeleteResult>;
}
