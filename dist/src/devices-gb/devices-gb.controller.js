"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesGbController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const applications_service_1 = require("../applications/applications.service");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const Role_1 = require("../auth/models/Role");
const ttn_service_1 = require("../common/services/ttn.service");
const influx_buckets_service_1 = require("../influx-buckets/influx-buckets.service");
const mqtt_access_service_1 = require("../mqtt-access/mqtt-access.service");
const devices_gb_service_1 = require("./devices-gb.service");
const create_devices_gb_dto_1 = require("./dto/create-devices-gb.dto");
const find_devices_gb_dto_1 = require("./dto/find-devices-gb.dto");
const update_devices_gb_dto_1 = require("./dto/update-devices-gb.dto");
let DevicesGbController = class DevicesGbController {
    constructor(connection, devicesGbService, influxBucketsService, applicationsService, mqttAccessesService, cacheService) {
        this.connection = connection;
        this.devicesGbService = devicesGbService;
        this.influxBucketsService = influxBucketsService;
        this.applicationsService = applicationsService;
        this.mqttAccessesService = mqttAccessesService;
        this.cacheService = cacheService;
    }
    async create(createDevicesGbDto) {
        const { clientId, applicationId, allows, devId, databaseId, communication, type, devEui, appEui, name, description, lorawanVersion, lorawanPhyVersion, frequencyPlanId, supportsJoin, appKey, username, password, topics, } = createDevicesGbDto;
        const transactionSession = await this.connection.startSession();
        transactionSession.startTransaction();
        let application;
        const bucket = await this.influxBucketsService.findOneWhere({
            clientId,
            influxConnectionId: databaseId,
            product: 'telemedicao-b',
        });
        const aux = devId.split(':');
        const ucCode = aux[1] ? aux[1] : null;
        const device = {
            clientId: clientId,
            devId: aux[0],
            type: type,
            bucketId: bucket._id,
            name: name,
            description: description,
            allows: allows,
            communication: communication,
        };
        if (type === 'GSM') {
            const hash = await bcrypt.hash(password, 10);
            const broker = {
                devId: aux[0],
                name: `Cliente do dispositivo ${aux[0]}`,
                topics,
                username,
                encryptedPassword: hash,
                type: 'client',
            };
            await this.mqttAccessesService.create(broker, transactionSession);
        }
        else if (type === 'LoRa') {
            application = await this.applicationsService.findOne(applicationId);
            if (!application) {
                throw {
                    name: 'ValidationError',
                    message: 'A aplicação selecionada não existe',
                };
            }
            device.applicationId = new mongoose.Types.ObjectId(applicationId);
        }
        if (type === 'LoRa') {
            await ttn_service_1.TtnService.post(`applications/${application.appId}/devices`, {
                end_device: {
                    ids: {
                        device_id: aux[0],
                        dev_eui: devEui,
                        join_eui: appEui,
                    },
                    name: name,
                    description: description,
                    join_server_address: 'eu1.cloud.thethings.network',
                    application_server_address: 'eu1.cloud.thethings.network',
                    network_server_address: 'eu1.cloud.thethings.network',
                },
                field_mask: {
                    paths: [
                        'name',
                        'description',
                        'join_server_address',
                        'application_server_address',
                        'network_server_address',
                    ],
                },
            });
            await ttn_service_1.TtnService.put(`ns/applications/${application.appId}/devices/${aux[0]}`, {
                end_device: {
                    lorawan_version: lorawanVersion,
                    lorawan_phy_version: lorawanPhyVersion,
                    frequency_plan_id: frequencyPlanId,
                    supports_join: supportsJoin,
                    ids: {
                        device_id: aux[0],
                        dev_eui: devEui,
                        join_eui: appEui,
                    },
                },
                field_mask: {
                    paths: [
                        'lorawan_version',
                        'lorawan_phy_version',
                        'frequency_plan_id',
                        'supports_join',
                        'ids.device_id',
                        'ids.dev_eui',
                        'ids.join_eui',
                    ],
                },
            });
            await ttn_service_1.TtnService.put(`as/applications/${application.appId}/devices/${aux[0]}`, {
                end_device: {
                    ids: {
                        device_id: aux[0],
                        dev_eui: devEui,
                        join_eui: appEui,
                    },
                },
                field_mask: {
                    paths: ['ids.device_id', 'ids.dev_eui', 'ids.join_eui'],
                },
            });
            await ttn_service_1.TtnService.put(`js/applications/${application.appId}/devices/${aux[0]}`, {
                end_device: {
                    ids: {
                        device_id: aux[0],
                        application_ids: {},
                        dev_eui: devEui,
                        join_eui: appEui,
                    },
                    root_keys: {
                        app_key: {
                            key: appKey,
                        },
                    },
                    application_server_address: 'eu1.cloud.thethings.network',
                    network_server_address: 'eu1.cloud.thethings.network',
                },
                field_mask: {
                    paths: [
                        'root_keys.app_key.key',
                        'ids.device_id',
                        'ids.dev_eui',
                        'ids.join_eui',
                        'application_server_address',
                        'network_server_address',
                    ],
                },
            });
        }
        const newInfos = await this.devicesGbService.findRedisDataByDevId(device.devId);
        await this.cacheService.set(`remota:${device.devId}`, newInfos);
        await transactionSession.commitTransaction();
        transactionSession.endSession();
    }
    async migrate(oldDeviceId, { deleteData, deviceId: newDeviceId }) {
        try {
            return this.devicesGbService.migrate(oldDeviceId, newDeviceId, deleteData);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.FORBIDDEN,
                error: 'Erro ao desativar dispositivo dispositivo.',
            }, common_1.HttpStatus.FORBIDDEN, {
                cause: error,
            });
        }
    }
    async findAll(query, user) {
        return this.devicesGbService.findAll(query, user);
    }
    async findOne(id) {
        const device = await this.devicesGbService.findOne(id);
        let response = {};
        if (device instanceof mongoose.Document) {
            if (device.type !== 'GSM') {
                const application = await this.applicationsService.findOne(device.applicationId.toString());
                if (application) {
                    const ttnDevice1 = await ttn_service_1.TtnService.get(`applications/${application.appId}/devices/${device.devId}?field_mask=name,description,version_ids,network_server_address,application_server_address,join_server_address,locations,attributes`);
                    const ttnDevice2 = await ttn_service_1.TtnService.get(`ns/applications/${application.appId}/devices/${device.devId}?field_mask=version_ids,frequency_plan_id,mac_settings,supports_class_b,supports_class_c,supports_join,lorawan_version,lorawan_phy_version,multicast,mac_state.recent_uplinks,pending_mac_state.recent_uplinks,session,pending_session`);
                    const ttnDevice3 = await ttn_service_1.TtnService.get(`js/applications/${application.appId}/devices/${device.devId}?field_mask=resets_join_nonces,network_server_address,application_server_address,net_id,application_server_id,application_server_kek_label,network_server_kek_label,claim_authentication_code,root_keys`);
                    response = {
                        ...device.toObject(),
                        ttnSync: ttnDevice1.data.ids.device_id === device.devId,
                        devEui: ttnDevice1.data.ids.dev_eui,
                        lorawanVersion: ttnDevice2.data.lorawan_version,
                        lorawanPhyVersion: ttnDevice2.data.lorawan_phy_version,
                        frequencyPlanId: ttnDevice2.data.frequency_plan_id,
                        appKey: ttnDevice3.data.root_keys.app_key.key,
                        joinEui: ttnDevice1.data.ids.join_eui,
                        name: ttnDevice1.data.name,
                        description: ttnDevice1.data.description,
                        appId: application.appId,
                    };
                }
            }
            else {
                const broker = await this.mqttAccessesService.findOneWhere({
                    devId: device.devId,
                });
                response = {
                    ...device.toObject(),
                    broker,
                };
            }
        }
        return response;
    }
    async update(id, updateDevicesGbDto) {
        const { clientId, applicationId, allows, databaseId, communication, type, devEui, appEui, username, name, description, lorawanVersion, lorawanPhyVersion, frequencyPlanId, supportsJoin, appKey, devId, password, topics, } = updateDevicesGbDto;
        const bucket = await this.influxBucketsService.findOneWhere({
            clientId,
            influxConnectionId: databaseId,
            product: 'telemedicao-b',
        });
        const device = {
            clientId,
            devId,
            type,
            username,
            name,
            description,
            bucketId: bucket._id.toString(),
            applicationId,
            allows,
            communication,
        };
        const hash = await bcrypt.hash(password, 10);
        const broker = password
            ? { devId, topics, username, encryptedPassword: hash }
            : { topics, username, devId };
        let updated;
        if (type === 'LoRa') {
            const application = await this.applicationsService.findOne(applicationId);
            if (!application) {
                throw {
                    name: 'ValidationError',
                    message: 'A aplicação selecionada não existe',
                };
            }
            updated = await this.devicesGbService.update(id, device);
            const ttnDevice = await ttn_service_1.TtnService.get(`/applications/${application.appId}/devices`);
            const index = ttnDevice.data.end_devices.findIndex((item) => item.ids.device_id === devId);
            if (index >= 0) {
                await ttn_service_1.TtnService.put(`applications/${application.appId}/devices/${devId}`, {
                    end_device: {
                        ids: {
                            device_id: devId,
                            dev_eui: devEui,
                            join_eui: appEui,
                        },
                        name,
                        description,
                        join_server_address: 'eu1.cloud.thethings.network',
                        application_server_address: 'eu1.cloud.thethings.network',
                        network_server_address: 'eu1.cloud.thethings.network',
                    },
                    field_mask: {
                        paths: [
                            'name',
                            'description',
                            'join_server_address',
                            'application_server_address',
                            'network_server_address',
                        ],
                    },
                });
            }
            else {
                await ttn_service_1.TtnService.post(`applications/${application.appId}/devices`, {
                    end_device: {
                        ids: {
                            device_id: devId,
                            dev_eui: devEui,
                            join_eui: appEui,
                        },
                        name,
                        description,
                        join_server_address: 'eu1.cloud.thethings.network',
                        application_server_address: 'eu1.cloud.thethings.network',
                        network_server_address: 'eu1.cloud.thethings.network',
                    },
                    field_mask: {
                        paths: [
                            'name',
                            'description',
                            'join_server_address',
                            'application_server_address',
                            'network_server_address',
                        ],
                    },
                });
            }
            await ttn_service_1.TtnService.put(`ns/applications/${application.appId}/devices/${devId}`, {
                end_device: {
                    lorawan_version: lorawanVersion,
                    lorawan_phy_version: lorawanPhyVersion,
                    frequency_plan_id: frequencyPlanId,
                    supports_join: supportsJoin,
                    ids: {
                        device_id: devId,
                        dev_eui: devEui,
                        join_eui: appEui,
                    },
                },
                field_mask: {
                    paths: [
                        'lorawan_version',
                        'lorawan_phy_version',
                        'frequency_plan_id',
                        'supports_join',
                        'ids.device_id',
                        'ids.dev_eui',
                        'ids.join_eui',
                    ],
                },
            });
            await ttn_service_1.TtnService.put(`as/applications/${application.appId}/devices/${devId}`, {
                end_device: {
                    ids: {
                        device_id: devId,
                        dev_eui: devEui,
                        join_eui: appEui,
                    },
                },
                field_mask: {
                    paths: ['ids.device_id', 'ids.dev_eui', 'ids.join_eui'],
                },
            });
            await ttn_service_1.TtnService.put(`js/applications/${application.appId}/devices/${devId}`, {
                end_device: {
                    ids: {
                        device_id: devId,
                        application_ids: {},
                        dev_eui: devEui,
                        join_eui: appEui,
                    },
                    root_keys: {
                        app_key: {
                            key: appKey,
                        },
                    },
                    application_server_address: 'eu1.cloud.thethings.network',
                    network_server_address: 'eu1.cloud.thethings.network',
                },
                field_mask: {
                    paths: [
                        'root_keys.app_key.key',
                        'ids.device_id',
                        'ids.dev_eui',
                        'ids.join_eui',
                        'application_server_address',
                        'network_server_address',
                    ],
                },
            });
        }
        else {
            await this.mqttAccessesService.updateOneWhere({ devId }, broker);
            updated = await this.devicesGbService.update(id, device);
        }
        const newInfos = await this.devicesGbService.findRedisDataByDevId(device.devId);
        await this.cacheService.set(`remota:${device.devId}`, JSON.stringify(newInfos));
        return updated;
    }
    async remove(id) {
        const device = await this.devicesGbService.findOne(id);
        const application = await this.applicationsService.findOne(device.applicationId.toString());
        await this.devicesGbService.remove(id);
        if (application && device.type === 'LoRa') {
            await ttn_service_1.TtnService.delete(`applications/${application.appId}/devices/${device.devId}`);
        }
        await this.cacheService.set(`remota:${device.devId}`, '');
        return;
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_devices_gb_dto_1.CreateDevicesGbDto]),
    __metadata("design:returntype", Promise)
], DevicesGbController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/migrate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevicesGbController.prototype, "migrate", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_devices_gb_dto_1.FindDevicesGbDto, Object]),
    __metadata("design:returntype", Promise)
], DevicesGbController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesGbController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_devices_gb_dto_1.UpdateDevicesGbDto]),
    __metadata("design:returntype", Promise)
], DevicesGbController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesGbController.prototype, "remove", null);
DevicesGbController = __decorate([
    (0, swagger_1.ApiTags)('Dispositivos Grupo B'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN, Role_1.Role.ADMIN, Role_1.Role.MANAGER, Role_1.Role.SUPPORT, Role_1.Role.VIEWER),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('devices-gb'),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(5, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose.Connection, devices_gb_service_1.DevicesGbService,
        influx_buckets_service_1.InfluxBucketsService,
        applications_service_1.ApplicationsService,
        mqtt_access_service_1.MqttAccessService, Object])
], DevicesGbController);
exports.DevicesGbController = DevicesGbController;
//# sourceMappingURL=devices-gb.controller.js.map