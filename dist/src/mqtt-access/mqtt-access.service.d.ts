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
import { CreateMqttAccessDto } from './dto/create-mqtt-access.dto';
import { UpdateMqttAccessDto } from './dto/update-mqtt-access.dto';
import { MqttAccess, MqttAccessDocument } from './entities/mqtt-access.entity';
export declare class MqttAccessService {
    private mqttAccessModel;
    constructor(mqttAccessModel: Model<MqttAccessDocument>);
    create(createMqttAccessDto: CreateMqttAccessDto, session?: ClientSession): Promise<import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(): import("mongoose").Query<(import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOne(id: string): import("mongoose").Query<import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOneWhere(where: FilterQuery<MqttAccessDocument>): import("mongoose").Query<import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateOneWhere(where: FilterQuery<MqttAccessDocument>, updateMqttAccessDto: UpdateMqttAccessDto, session?: ClientSession): import("mongoose").Query<import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, updateMqttAccessDto: UpdateMqttAccessDto): import("mongoose").Query<import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    clearStatus(): import("mongoose").Query<import("mongodb").UpdateResult, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    connect(devId: string): import("mongoose").Query<import("mongodb").UpdateResult, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    disconnect(devId: string): import("mongoose").Query<import("mongodb").UpdateResult, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: string): import("mongoose").Query<import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, MqttAccess> & MqttAccess & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
