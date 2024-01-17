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
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application, ApplicationDocument } from './entities/application.entity';
export declare class ApplicationsService {
    private applicationModel;
    constructor(applicationModel: Model<ApplicationDocument>);
    create(createApplicationDto: CreateApplicationDto, token: string, session: ClientSession): Promise<import("mongoose").Document<unknown, any, Application> & Application & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").Document<unknown, any, Application> & Application & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): import("mongoose").Query<import("mongoose").Document<unknown, any, Application> & Application & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, Application> & Application & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, Application> & Application & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findWhere(where: FilterQuery<ApplicationDocument>): Promise<(import("mongoose").Document<unknown, any, Application> & Application & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOneWhere(where: FilterQuery<ApplicationDocument>): Promise<import("mongoose").Document<unknown, any, Application> & Application & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(appId: string, updateApplicationDto: UpdateApplicationDto, session: ClientSession): import("mongoose").Query<import("mongoose").Document<unknown, any, Application> & Application & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, Application> & Application & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, Application> & Application & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(appId: string): Promise<import("mongodb").DeleteResult>;
}
