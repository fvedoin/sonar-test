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
import { CreateMeterChangeDto } from './dto/create-meter-change.dto';
import { UpdateMeterChangeDto } from './dto/update-meter-change.dto';
import { MeterChangeService } from './meter-change.service';
export declare class MeterChangeController {
    private readonly meterChangeService;
    constructor(meterChangeService: MeterChangeService);
    create(CreateMeterChangeDto: CreateMeterChangeDto): Promise<import("./entities/meter-change.entity").MeterChanges>;
    findAll(user: UserFromJwt): Promise<Omit<import("mongoose").Document<unknown, any, import("./entities/meter-change.entity").MeterChanges> & import("./entities/meter-change.entity").MeterChanges & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>[]>;
    findOne(id: string): Promise<import("./entities/meter-change.entity").MeterChanges>;
    update(id: string, updateMeterChangeDto: UpdateMeterChangeDto): Promise<import("mongoose").Document<unknown, any, import("./entities/meter-change.entity").MeterChanges> & import("./entities/meter-change.entity").MeterChanges & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(ids: string): Promise<void>;
}
