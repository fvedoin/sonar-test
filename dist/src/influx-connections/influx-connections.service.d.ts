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
import { Document, Model, Types } from 'mongoose';
import { CreateInfluxConnectionDto } from './dto/create-influx-connection.dto';
import { UpdateInfluxConnectionDto } from './dto/update-influx-connection.dto';
import { InfluxConnection, InfluxConnectionDocument } from './entities/influx-connection.entity';
export declare class InfluxConnectionsService {
    private influxConnectionModel;
    constructor(influxConnectionModel: Model<InfluxConnectionDocument>);
    create(createInfluxConnectionDto: CreateInfluxConnectionDto): Promise<Document<unknown, any, InfluxConnection> & InfluxConnection & Required<{
        _id: Types.ObjectId;
    }>>;
    findAll(): import("mongoose").Query<(Document<unknown, any, InfluxConnection> & InfluxConnection & Required<{
        _id: Types.ObjectId;
    }>)[], Document<unknown, any, InfluxConnection> & InfluxConnection & Required<{
        _id: Types.ObjectId;
    }>, {}, Document<unknown, any, InfluxConnection> & InfluxConnection & Required<{
        _id: Types.ObjectId;
    }>>;
    findOne(id: string | (Document<unknown, any, InfluxConnection> & InfluxConnection & {
        _id: Types.ObjectId;
    })): import("mongoose").Query<Document<unknown, any, InfluxConnection> & InfluxConnection & Required<{
        _id: Types.ObjectId;
    }>, Document<unknown, any, InfluxConnection> & InfluxConnection & Required<{
        _id: Types.ObjectId;
    }>, {}, Document<unknown, any, InfluxConnection> & InfluxConnection & Required<{
        _id: Types.ObjectId;
    }>>;
    update(id: string, updateInfluxConnectionDto: UpdateInfluxConnectionDto): import("mongoose").Query<Document<unknown, any, InfluxConnection> & InfluxConnection & Required<{
        _id: Types.ObjectId;
    }>, Document<unknown, any, InfluxConnection> & InfluxConnection & Required<{
        _id: Types.ObjectId;
    }>, {}, Document<unknown, any, InfluxConnection> & InfluxConnection & Required<{
        _id: Types.ObjectId;
    }>>;
    remove(id: string): Promise<import("mongodb").DeleteResult>;
}
