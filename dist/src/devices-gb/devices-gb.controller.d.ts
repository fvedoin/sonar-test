import { Cache } from 'cache-manager';
import * as mongoose from 'mongoose';
import { ApplicationsService } from 'src/applications/applications.service';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { MqttAccessService } from 'src/mqtt-access/mqtt-access.service';
import { DevicesGbService } from './devices-gb.service';
import { CreateDevicesGbDto } from './dto/create-devices-gb.dto';
import { FindDevicesGbDto } from './dto/find-devices-gb.dto';
import { UpdateDevicesGbDto } from './dto/update-devices-gb.dto';
export declare class DevicesGbController {
    private readonly connection;
    private readonly devicesGbService;
    private readonly influxBucketsService;
    private readonly applicationsService;
    private readonly mqttAccessesService;
    private cacheService;
    constructor(connection: mongoose.Connection, devicesGbService: DevicesGbService, influxBucketsService: InfluxBucketsService, applicationsService: ApplicationsService, mqttAccessesService: MqttAccessService, cacheService: Cache);
    create(createDevicesGbDto: CreateDevicesGbDto): Promise<void>;
    migrate(oldDeviceId: string, { deleteData, deviceId: newDeviceId }: {
        deleteData: any;
        deviceId: any;
    }): Promise<void>;
    findAll(query: FindDevicesGbDto, user: UserFromJwt): Promise<{
        data: any;
        pageInfo: any;
    }>;
    findOne(id: string): Promise<{}>;
    update(id: string, updateDevicesGbDto: UpdateDevicesGbDto): Promise<any>;
    remove(id: string): Promise<void>;
}
