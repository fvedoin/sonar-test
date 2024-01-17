/// <reference types="multer" />
import { CreateUcDto } from './dto/create-uc.dto';
import { UpdateUcDto } from './dto/update-uc.dto';
import { UcsRepository } from './ucs.repository';
import { Uc } from './entities/uc.entity';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { TransformersService } from 'src/transformers/transformers.service';
import { ProcessUcsDto } from './dto/processUcs.dto';
import { ClientsService } from 'src/clients/clients.service';
import { QueryFindAllDto, QueryFindAllPaginateDto } from './dto/queryFindAll.dto';
import { DeviceGb } from 'src/devices-gb/entities/devices-gb.entity';
import mongoose, { FilterQuery, ProjectionFields, Types } from 'mongoose';
import { DevicesGbService } from 'src/devices-gb/devices-gb.service';
import { NotificationService } from 'src/notification/notification.service';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { UsersService } from 'src/users/users.service';
import { UcdisabledHistoryService } from 'src/ucdisabled-history/ucdisabled-history.service';
import { Cache } from 'cache-manager';
export declare class UcsService {
    private readonly ucRepository;
    private readonly usersService;
    private readonly transformersService;
    private readonly clientsService;
    private readonly devicesGbService;
    private readonly ucDisabledHistoryService;
    private readonly influxBucketsService;
    private readonly notificationService;
    private readonly connection;
    private cacheService;
    constructor(ucRepository: UcsRepository, usersService: UsersService, transformersService: TransformersService, clientsService: ClientsService, devicesGbService: DevicesGbService, ucDisabledHistoryService: UcdisabledHistoryService, influxBucketsService: InfluxBucketsService, notificationService: NotificationService, connection: mongoose.Connection, cacheService: Cache);
    create(createUcDto: CreateUcDto, currentUser: UserFromJwt): Promise<Uc>;
    _extractUcs(file: Express.Multer.File): Promise<any[]>;
    _convertUtmToLatLng(lat: string, long: string, fuso: string): Promise<any>;
    processCSV(file: Express.Multer.File, clientId: string, isAdmin: boolean, userId: string): Promise<ProcessUcsDto[]>;
    private findClientsIds;
    private findDevices;
    applyPaginationClientFilterByRole: ({ currentUser }: {
        currentUser: any;
    }) => any[];
    findPaginated(currentUser: UserFromJwt, query: QueryFindAllPaginateDto): Promise<{
        data: any;
        pageInfo: any;
    }>;
    findAll(currentUser: UserFromJwt, query: QueryFindAllDto): Promise<any>;
    findById(_id: string): Promise<Uc>;
    findByIdPopulate(id: string, populate?: string[]): Promise<mongoose.Document<unknown, any, Uc> & Uc & Required<{
        _id: Types.ObjectId;
    }>>;
    findWhere(where: FilterQuery<Uc>, projection?: ProjectionFields<Uc>): Promise<(Uc & {
        deviceId: mongoose.Document<unknown, any, DeviceGb> & DeviceGb & Required<{
            _id: Types.ObjectId;
        }> & {
            clientId: string;
            bucketId: string;
        };
    })[]>;
    findWhereDetails(where: FilterQuery<Uc>, projection?: ProjectionFields<Uc>): Promise<any>;
    findByUcCode(ucCode: string): Promise<Uc>;
    update(id: string, updateUcDto: UpdateUcDto, currentUser: UserFromJwt): Promise<mongoose.Document<unknown, any, Uc> & Uc & Required<{
        _id: Types.ObjectId;
    }>>;
    changeDevice({ id, deviceId, deleteData, user, }: {
        id: string;
        deviceId: string;
        deleteData: boolean;
        user: UserFromJwt;
    }): Promise<void>;
    disable(id: string, deleteData: boolean, user: UserFromJwt): Promise<void>;
    findByUcCodesPopulate(ucCodes: string[]): Promise<(Uc & {
        deviceId: mongoose.Document<unknown, any, DeviceGb> & DeviceGb & Required<{
            _id: Types.ObjectId;
        }> & {
            clientId: string;
            bucketId: string;
        };
    })[]>;
    updateByUcCodeOrInsert(ucs: ProcessUcsDto[]): Promise<(mongoose.Document<unknown, any, Uc> & Uc & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    removeOne(id: string): Promise<void>;
    removeMany(ids: string[]): Promise<void>;
}
