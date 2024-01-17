import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsRepository } from './setting.repository';
import mongoose, { FilterQuery, ProjectionFields } from 'mongoose';
import { Setting } from './entities/setting.entity';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { FindDevicesGbDto } from 'src/devices-gb/dto/find-devices-gb.dto';
export declare class SettingsService {
    private readonly settingRepository;
    private readonly eventEmitter;
    constructor(settingRepository: SettingsRepository, eventEmitter: EventEmitter2);
    getDefaultSettings(): Setting;
    sanitizeValue(dto: CreateSettingDto | UpdateSettingDto): {
        precariousVoltageAbove: string;
        precariousVoltageBelow: string;
        criticalVoltageAbove: string;
        criticalVoltageBelow: string;
        clientId: string | mongoose.Types.ObjectId | import("../clients/entities/client.entity").Client;
        offlineTime: number;
        peakHourStart: number;
        peakHourEnd: number;
    } | {
        precariousVoltageAbove: string;
        precariousVoltageBelow: string;
        criticalVoltageAbove: string;
        criticalVoltageBelow: string;
        clientId?: string | mongoose.Types.ObjectId | import("../clients/entities/client.entity").Client;
        offlineTime?: number;
        peakHourStart?: number;
        peakHourEnd?: number;
    };
    create(createSettingDto: CreateSettingDto): Promise<Setting>;
    findAll(query: FindDevicesGbDto, user: UserFromJwt): Promise<{
        data: any;
        pageInfo: any;
    }>;
    private buildGeneralWhereClause;
    private buildAggregatePipeline;
    findAllPopulate({ edges, searchText, filter, fieldMask }: any): Promise<{
        data: any;
        pageInfo: any;
    }>;
    parseVoltageRange(voltage: string): Promise<{
        low: number;
        high: number;
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
    find(query: FilterQuery<Setting>, projection?: ProjectionFields<Setting>): Promise<Setting>;
    update(id: string, updateSettingDto: UpdateSettingDto): Promise<mongoose.Document<unknown, any, Setting> & Setting & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    remove(id: string[]): Promise<void>;
}
