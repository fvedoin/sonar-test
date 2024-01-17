/// <reference types="multer" />
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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { CreateUcDto } from './dto/create-uc.dto';
import { UpdateUcDto } from './dto/update-uc.dto';
import { UcsService } from './ucs.service';
import { ProcessUcsDto } from './dto/processUcs.dto';
import { QueryFindAllDto, QueryFindAllPaginateDto } from './dto/queryFindAll.dto';
export declare class UcsController {
    private readonly ucsService;
    constructor(ucsService: UcsService);
    create(createUcDto: CreateUcDto, currentUser: UserFromJwt): Promise<import("./entities/uc.entity").Uc>;
    createMany(data: ProcessUcsDto[]): Promise<(import("mongoose").Document<unknown, any, import("./entities/uc.entity").Uc> & import("./entities/uc.entity").Uc & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    processCsv(body: {
        clientId: string;
    }, file: Express.Multer.File, currentUser: UserFromJwt): Promise<ProcessUcsDto[]>;
    findAll(query: QueryFindAllDto, currentUser: UserFromJwt): Promise<any>;
    findAllPaginated(query: QueryFindAllPaginateDto, currentUser: UserFromJwt): Promise<{
        data: any;
        pageInfo: any;
    }>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, any, import("./entities/uc.entity").Uc> & import("./entities/uc.entity").Uc & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findOneByCode(ucCode: string): Promise<(import("./entities/uc.entity").Uc & {
        deviceId: import("mongoose").Document<unknown, any, import("../devices-gb/entities/devices-gb.entity").DeviceGb> & import("../devices-gb/entities/devices-gb.entity").DeviceGb & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            clientId: string;
            bucketId: string;
        };
    })[]>;
    findOneBy(ucCode: string): Promise<any>;
    findAllByClientId(clientId: string): Promise<(import("./entities/uc.entity").Uc & {
        deviceId: import("mongoose").Document<unknown, any, import("../devices-gb/entities/devices-gb.entity").DeviceGb> & import("../devices-gb/entities/devices-gb.entity").DeviceGb & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            clientId: string;
            bucketId: string;
        };
    })[]>;
    update(id: string, updateUcDto: UpdateUcDto, currentUser: UserFromJwt): Promise<import("mongoose").Document<unknown, any, import("./entities/uc.entity").Uc> & import("./entities/uc.entity").Uc & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    disable(user: UserFromJwt, id: string, { deleteData }: {
        deleteData: any;
    }): Promise<void>;
    changeDevice(user: UserFromJwt, id: string, { deleteData, deviceId }: {
        deleteData: any;
        deviceId: any;
    }): Promise<void>;
    remove(id: string): Promise<void>;
    removeMany(id: string): Promise<void>;
}
