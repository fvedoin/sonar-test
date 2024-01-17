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
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { AreaRepository } from './area.repository';
export declare class AreaService {
    private readonly areaRepository;
    constructor(areaRepository: AreaRepository);
    create(createAreaDto: CreateAreaDto, user: UserFromJwt): Promise<import("./entities/area.entity").Area>;
    parsePoints(points: CreateAreaDto['points']): {
        type: string;
        coordinates: number[];
    }[];
    findAll(user: UserFromJwt): Promise<Omit<import("mongoose").Document<unknown, any, import("./entities/area.entity").Area> & import("./entities/area.entity").Area & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>[]>;
    findOne(id: string): Promise<import("./entities/area.entity").Area>;
    update(id: string, updateAreaDto: UpdateAreaDto, user: UserFromJwt): Promise<import("mongoose").Document<unknown, any, import("./entities/area.entity").Area> & import("./entities/area.entity").Area & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string[]): Promise<void>;
}
