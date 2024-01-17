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
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './setting.service';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { FindUcDisableHistoryDto } from 'src/ucdisabled-history/dto/find-ucdisabled-history.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    create(createSettingDto: CreateSettingDto): Promise<import("./entities/setting.entity").Setting>;
    findAll(query: FindUcDisableHistoryDto, user: UserFromJwt): Promise<{
        data: any;
        pageInfo: any;
    }>;
    findCriticalAndPrecariousVoltages(user: UserFromJwt, clientId: string): Promise<{
        precariousVoltageAbove: {
            low: number;
            high: number;
        };
        precariousVoltageBelow: {
            low: number;
            high: number;
        };
        criticalVoltageAbove: {
            low: number;
            high: number;
        };
        criticalVoltageBelow: {
            low: number;
            high: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/setting.entity").Setting>;
    update(id: string, updateSettingDto: UpdateSettingDto): Promise<import("mongoose").Document<unknown, any, import("./entities/setting.entity").Setting> & import("./entities/setting.entity").Setting & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(id: string): Promise<void>;
}
