import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { ClientsService } from 'src/clients/clients.service';
import { MqttAccessService } from 'src/mqtt-access/mqtt-access.service';
import { DevicesTrService } from './devices-tr.service';
import { FindDevicesTrDto } from './dto/find-devices-tr.dto';
import { FindDeviceTrAnalyticsDto } from './dto/find-device-tr-analytcs.dto';
export declare class DevicesTrController {
    private readonly devicesTrService;
    private readonly clientsService;
    private readonly mqttAccessesService;
    constructor(devicesTrService: DevicesTrService, clientsService: ClientsService, mqttAccessesService: MqttAccessService);
    findAll({ clientId }: FindDevicesTrDto, user: UserFromJwt): Promise<any[]>;
    findFilteredDevicesTr(user: UserFromJwt): Promise<any[]>;
    findFilteredTransformerTelikTrafoLite(user: UserFromJwt, clientId: string): Promise<any[]>;
    findFilteredTransformerDevices(user: UserFromJwt, clientId: string): Promise<any[]>;
    getTelikTrafoLiteDevices(user: UserFromJwt): Promise<any[]>;
    getAnalytics(query: FindDeviceTrAnalyticsDto): Promise<string[][]>;
    findOne(id: string): Promise<{
        device: import("./entities/devices-tr.entity").DeviceTr;
        broker: import("mongoose").Document<unknown, any, import("../mqtt-access/entities/mqtt-access.entity").MqttAccess> & import("../mqtt-access/entities/mqtt-access.entity").MqttAccess & {
            _id: import("mongoose").Types.ObjectId;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    remove(ids: string): Promise<void>;
}
