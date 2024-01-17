import { Cache } from 'cache-manager';
import mongoose, { ClientSession, FilterQuery } from 'mongoose';
import { UpdateDevicesGbDto } from './dto/update-devices-gb.dto';
import { DeviceGb, DeviceGbDocument } from './entities/devices-gb.entity';
import { FindDevicesGbDto } from './dto/find-devices-gb.dto';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { DevicesGbRepository } from './devices-gb.repository';
import { CreateDevicesGbDto } from './dto/create-devices-gb.dto';
import { InfluxConnectionsService } from 'src/influx-connections/influx-connections.service';
import { InfluxService } from 'src/influx/influx.service';
import { Uc } from 'src/ucs/entities/uc.entity';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { dataToWriteInInflux } from 'src/influx/interfaces/dataToWriteInInflux';
import { NotificationService } from 'src/notification/notification.service';
export declare class DevicesGbService {
    private readonly devicesGbRepository;
    private readonly influxService;
    private readonly influxConnectionsService;
    private readonly notificationService;
    private readonly influxBucketsService;
    private readonly connection;
    private cacheService;
    private logger;
    constructor(devicesGbRepository: DevicesGbRepository, influxService: InfluxService, influxConnectionsService: InfluxConnectionsService, notificationService: NotificationService, influxBucketsService: InfluxBucketsService, connection: mongoose.Connection, cacheService: Cache);
    create(createDevicesGbDto: CreateDevicesGbDto, session?: ClientSession): Promise<DeviceGb>;
    saveDevicesInCache(clientId: string): Promise<void>;
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
    findOne(id: string): Promise<DeviceGb>;
    update(id: string, updateDevicesGbDto: UpdateDevicesGbDto): Promise<mongoose.Document<unknown, any, DeviceGb> & DeviceGb & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    findWhere(whereClause: FilterQuery<DeviceGbDocument>): Promise<DeviceGb[]>;
    remove(id: string): Promise<void>;
    migrate(oldDeviceId: string, newDeviceId: string, deleteData: boolean): Promise<void>;
    findByDevId(devId: string): Promise<DeviceGb>;
    findRedisDataByDevId(devId: any): Promise<any[]>;
    findByIdPopulate(id: string, populate: string[]): Promise<Omit<mongoose.Document<unknown, any, DeviceGb> & DeviceGb & Required<{
        _id: mongoose.Types.ObjectId;
    }>, never>>;
    migrateDevice({ oldDevice, newDevice, deleteOldData, uc, hardwareSerial, transactionSession, }: {
        oldDevice: DeviceGb;
        newDevice: DeviceGb;
        deleteOldData: any;
        hardwareSerial: any;
        uc?: Uc;
        transactionSession: ClientSession;
    }): Promise<void>;
    handleStreamUcData({ newDevice, hardwareSerial }: {
        newDevice: any;
        hardwareSerial: any;
    }): (stream: NodeJS.ReadableStream) => Promise<void>;
    writeInInflux(newDevice: DeviceGb, allPoints: dataToWriteInInflux[]): Promise<unknown>;
}
