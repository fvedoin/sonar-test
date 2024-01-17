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
var DevicesGbService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesGbService = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("@nestjs/event-emitter/dist/decorators");
const mongoose_1 = require("mongoose");
const constants_1 = require("../common/constants");
const devices_gb_repository_1 = require("./devices-gb.repository");
const utils_1 = require("../utils/utils");
const filterHandler_1 = require("../utils/filterHandler");
const ttn_service_1 = require("../common/services/ttn.service");
const influxdb_client_1 = require("@influxdata/influxdb-client");
const influx_connections_service_1 = require("../influx-connections/influx-connections.service");
const influx_service_1 = require("../influx/influx.service");
const influx_buckets_service_1 = require("../influx-buckets/influx-buckets.service");
const mongoose_2 = require("@nestjs/mongoose");
const notification_service_1 = require("../notification/notification.service");
const Role_1 = require("../auth/models/Role");
const fields = [
    'devId',
    'name',
    'ucs.ucCode',
    'clientId.name',
    'applicationId.name',
    'type',
    'communication',
    'allows',
];
let DevicesGbService = DevicesGbService_1 = class DevicesGbService {
    constructor(devicesGbRepository, influxService, influxConnectionsService, notificationService, influxBucketsService, connection, cacheService) {
        this.devicesGbRepository = devicesGbRepository;
        this.influxService = influxService;
        this.influxConnectionsService = influxConnectionsService;
        this.notificationService = notificationService;
        this.influxBucketsService = influxBucketsService;
        this.connection = connection;
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(DevicesGbService_1.name);
    }
    create(createDevicesGbDto, session) {
        return this.devicesGbRepository.create(createDevicesGbDto, { session });
    }
    async saveDevicesInCache(clientId) {
        this.logger.log('Save devices in cache');
        const devices = await this.devicesGbRepository.find({ clientId });
        for await (const device of devices) {
            const newInfos = await this.findRedisDataByDevId(device.devId);
            await this.cacheService.set(`remota:${device.devId}`, JSON.stringify(newInfos));
        }
    }
    async findAll(query, user) {
        const { clientId, sort, skip, limit, searchText, filter = [], fieldMask, } = query;
        const convertedSort = sort ? (0, utils_1.convertPropertiesToInt)(sort) : { it: 1 };
        const convertedFieldMask = fieldMask
            ? (0, utils_1.convertPropertiesToInt)(fieldMask)
            : null;
        const convertedFilter = (0, utils_1.convertPropertiesToBoolean)(filter);
        const edges = [{ $sort: convertedSort }];
        const handledFilters = (0, filterHandler_1.handleFilters)(convertedFilter);
        if (skip) {
            edges.push({ $skip: Number(skip) });
        }
        if (limit) {
            edges.push({ $limit: Number(limit) });
        }
        const searchOpts = {
            edges,
            searchText,
            filter: handledFilters,
            fieldMask: convertedFieldMask,
            match: {},
        };
        if (clientId) {
            searchOpts.filter.push({
                'clientId._id': new mongoose_1.default.Types.ObjectId(clientId),
            });
            return this.findAllPopulate(searchOpts);
        }
        if (user.accessLevel === 'admin' || user.accessLevel === 'support') {
            return this.findAllPopulate(searchOpts);
        }
        if (user.accessLevel === Role_1.Role.ADMIN) {
            searchOpts.filter.push({
                $or: [
                    {
                        'clientId._id': new mongoose_1.default.Types.ObjectId(user.clientId),
                    },
                    {
                        'clientId.parentId': new mongoose_1.default.Types.ObjectId(user.clientId),
                    },
                ],
            });
            return this.findAllPopulate(searchOpts);
        }
        if (user.clientId) {
            searchOpts.filter.push({
                'clientId._id': new mongoose_1.default.Types.ObjectId(user.clientId),
            });
            return this.findAllPopulate(searchOpts);
        }
    }
    buildGeneralWhereClause(searchText, filter) {
        const generalWhereClause = {};
        if (searchText) {
            generalWhereClause.$and = [
                {
                    $or: [
                        ...fields.map((item) => {
                            return { [item]: { $regex: searchText, $options: 'i' } };
                        }),
                    ],
                },
            ];
        }
        const generalFilters = filter || [];
        if (generalFilters.length > 0) {
            if (generalWhereClause.$and) {
                generalWhereClause.$and.push({
                    $and: generalFilters,
                });
            }
            else {
                generalWhereClause.$and = [{ $and: generalFilters }];
            }
        }
        if (generalWhereClause.$and) {
            generalWhereClause.$and.push({
                devId: { $not: { $regex: 'ucd-', $options: 'i' } },
            });
        }
        else {
            generalWhereClause.$and = [
                { devId: { $not: { $regex: 'ucd-', $options: 'i' } } },
            ];
        }
        return generalWhereClause;
    }
    buildAggregatePipeline(generalWhereClause, fieldMask, edges) {
        const aggregatePipeline = [
            {
                $lookup: {
                    from: 'lastreceiveds',
                    localField: '_id',
                    foreignField: 'deviceId',
                    as: 'lastReceived',
                },
            },
            { $unwind: { path: '$lastReceived', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'settings',
                    localField: 'settings',
                    foreignField: 'settings',
                    as: 'settings',
                },
            },
            { $unwind: { path: '$settings', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'ucs',
                    localField: '_id',
                    foreignField: 'deviceId',
                    as: 'ucs',
                },
            },
            { $unwind: { path: '$ucs', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'applications',
                    localField: 'applicationId',
                    foreignField: '_id',
                    as: 'applicationId',
                },
            },
            { $unwind: { path: '$applicationId', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'clients',
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'clientId',
                },
            },
            { $match: generalWhereClause },
            { $unwind: { path: '$clientId', preserveNullAndEmptyArrays: true } },
        ];
        aggregatePipeline.push({
            $group: {
                _id: '$_id',
                settings: { $first: '$settings' },
                applicationId: { $first: '$applicationId' },
                lastReceived: { $push: '$lastReceived' },
                type: { $first: '$type' },
                devId: { $first: '$devId' },
                communication: { $first: '$communication' },
                allows: { $first: '$allows' },
                name: { $first: '$name' },
                ucs: { $first: '$ucs' },
                clientId: { $first: '$clientId' },
            },
        }, {
            $project: fieldMask || {
                _id: 1,
                applicationId: 1,
                devId: 1,
                lastReceived: 1,
                settings: 1,
                type: 1,
                communication: 1,
                allows: 1,
                name: 1,
                clientId: 1,
                ucs: 1,
            },
        }, {
            $facet: {
                edges,
                pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
            },
        });
        return aggregatePipeline;
    }
    async findAllPopulate({ edges, searchText, filter, fieldMask }) {
        const generalWhereClause = this.buildGeneralWhereClause(searchText, filter);
        const aggregatePipeline = this.buildAggregatePipeline(generalWhereClause, fieldMask, edges);
        const result = await this.devicesGbRepository.aggregate(aggregatePipeline);
        return {
            data: result[0].edges,
            pageInfo: result[0].pageInfo[0],
        };
    }
    findOne(id) {
        return this.devicesGbRepository.findOne({ _id: id });
    }
    update(id, updateDevicesGbDto) {
        return this.devicesGbRepository.findOneAndUpdate({ _id: id }, updateDevicesGbDto);
    }
    async findWhere(whereClause) {
        return this.devicesGbRepository.find(whereClause);
    }
    remove(id) {
        return this.devicesGbRepository.deleteMany({ _id: id });
    }
    async migrate(oldDeviceId, newDeviceId, deleteData) {
        if (oldDeviceId === newDeviceId) {
            throw new Error('Não foi possível migrar. Dispositivos precisam ser diferentes.');
        }
        const newDevice = await this.devicesGbRepository.findByIdPopulate(newDeviceId, ['bucketId', 'applicationId']);
        const applicationId = newDevice.applicationId;
        const newDevEui = newDevice.type === 'LoRa'
            ? await ttn_service_1.TtnService.get(`applications/${applicationId.appId}/devices/${newDevice.devId}`)
            : null;
        const oldDevice = await this.devicesGbRepository.findByIdPopulate(oldDeviceId, ['bucketId', 'applicationId']);
        if (!newDevice) {
            throw new Error('Não foi possível alterar. Novo dispositivo não foi encontrado.');
        }
        if (!oldDevice) {
            throw new Error('Não foi possível alterar. Antigo dispositivo não foi encontrado.');
        }
        const transactionSession = await this.connection.startSession();
        transactionSession.startTransaction();
        try {
            await this.migrateDevice({
                oldDevice,
                newDevice,
                deleteOldData: deleteData,
                transactionSession,
                hardwareSerial: newDevEui && newDevEui.data ? newDevEui.data.ids.dev_eui : null,
            });
        }
        catch (err) {
            const oldClientId = oldDevice.clientId.toString();
            const message = `Ocorreu um erro durante a troca de dispositivos ${oldDevice.devId} e ${newDevice.devId}. Entre em contato com o suporte`;
            await this.notificationService.create({
                clientId: oldClientId,
                title: `Erro ao trocar dispositivos!`,
                message,
                createdAt: new Date(),
            });
            await transactionSession.abortTransaction();
            await transactionSession.endSession();
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Erro ao migrar UC',
                stacktrace: err.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: err,
            });
        }
        const message = `A troca do dispositivos ${oldDevice.devId} e ${newDevice.devId} foi bem sucedida.`;
        await this.notificationService.create({
            clientId: oldDevice.clientId.toString(),
            title: `Troca de dispositivos bem sucedida!`,
            message,
            createdAt: new Date(),
        });
        await transactionSession.commitTransaction();
        transactionSession.endSession();
    }
    async findByDevId(devId) {
        return this.devicesGbRepository.findOne({ devId });
    }
    async findRedisDataByDevId(devId) {
        return this.devicesGbRepository.aggregate([
            {
                $match: {
                    devId: devId,
                },
            },
            {
                $lookup: {
                    from: 'alerts',
                    localField: '_id',
                    foreignField: 'deviceId',
                    as: 'alerts',
                },
            },
            {
                $unwind: {
                    path: '$alerts',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'ucs',
                    localField: '_id',
                    foreignField: 'deviceId',
                    as: 'uc',
                },
            },
            {
                $unwind: {
                    path: '$uc',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'settings',
                    localField: 'clientId',
                    foreignField: 'clientId',
                    as: 'settings',
                },
            },
            {
                $unwind: {
                    path: '$settings',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    uc: { $first: '$uc' },
                    settings: { $first: '$settings' },
                    devId: { $first: '$devId' },
                    applicationId: { $first: '$applicationId' },
                    alerts: { $push: '$alerts' },
                },
            },
            {
                $project: {
                    _id: 1,
                    applicationId: 1,
                    devId: 1,
                    alerts: {
                        $filter: {
                            input: '$alerts',
                            as: 'a',
                            cond: { $ifNull: ['$$a._id', false] },
                        },
                    },
                    uc: 1,
                    settings: 1,
                },
            },
        ]);
    }
    async findByIdPopulate(id, populate) {
        const device = await this.devicesGbRepository.findById(id);
        return device.populate(populate);
    }
    async migrateDevice({ oldDevice, newDevice, deleteOldData, uc, hardwareSerial, transactionSession, }) {
        try {
            await this.devicesGbRepository.migrateDevices({
                oldDevice,
                newDevice,
                uc,
                transactionSession,
            });
            const oldBucket = oldDevice.bucketId;
            const oldInfluxConnectionId = oldBucket.influxConnectionId.toString();
            const oldInfluxConnection = await this.influxConnectionsService.findOne(oldInfluxConnectionId);
            if (!oldInfluxConnection) {
                throw new Error('Influx Connection não encontrada');
            }
            const stream = await this.influxService
                .getAllDataByDevId({
                apiToken: oldInfluxConnection.apiToken,
                bucketName: oldBucket.name,
                devId: oldDevice.devId,
                host: oldInfluxConnection.host,
                orgId: oldInfluxConnection.orgId,
            })
                .then((response) => {
                const stream = response.data;
                return stream;
            })
                .catch((error) => {
                throw new Error('Erro ao buscar os dados do influx');
            });
            await this.handleStreamUcData({
                hardwareSerial,
                newDevice,
            })(stream);
            if (deleteOldData) {
                this.influxService
                    .deleteOldDataByDevId({
                    apiToken: oldInfluxConnection.apiToken,
                    bucketName: oldBucket.name,
                    devId: oldDevice.devId,
                    host: oldInfluxConnection.host,
                    orgId: oldInfluxConnection.orgId,
                })
                    .catch((error) => {
                    throw new Error('Erro ao deletar dados antigos');
                });
            }
            await this.cacheService.set(`remota:${oldDevice.devId}`, '');
            await this.cacheService.set(`remota:${newDevice.devId}`, '');
        }
        catch (err) {
            throw new Error(err);
        }
    }
    handleStreamUcData({ newDevice, hardwareSerial }) {
        const writeInInflux = this.writeInInflux.bind(this);
        return async (stream) => {
            await new Promise((resolve, reject) => {
                let points = '';
                stream.on('data', function (data) {
                    const parsed = data.toString();
                    points += parsed;
                });
                stream.on('end', async function () {
                    let toInsert = [];
                    if (!points.trim().length)
                        resolve(void 0);
                    const results = points.split('\n');
                    const columns = results[0].replace('\r', '').split(',');
                    results.shift();
                    columns.splice(0, 3);
                    const values = results.map((result, i) => {
                        const valores = result.replace('\r', '').split(',');
                        valores.splice(0, 3);
                        const response = {};
                        valores.forEach((value, index) => {
                            response[columns[index]] = value;
                        });
                        return response;
                    });
                    for await (const value of values) {
                        if (!isNaN(new Date(value['_time']).getTime())) {
                            const payloadToInsert = {
                                measurement: 'payload',
                                time: value['_time'],
                                tags: {
                                    dev_id: newDevice.devId,
                                },
                                fields: {
                                    integer: {
                                        counter: Number(value['counter']),
                                        port: Number(value['port']),
                                    },
                                    string: {
                                        dev_eui: hardwareSerial,
                                    },
                                    float: {
                                        counter_fall: value['counter_fall']
                                            ? Number(value['counter_fall'])
                                            : null,
                                        counter_return: value['counter_return']
                                            ? Number(value['counter_return'])
                                            : null,
                                        energy_fall_time: value['energy_fall_time']
                                            ? Number(value['energy_fall_time'])
                                            : null,
                                        energy_return_time: value['energy_return_time']
                                            ? Number(value['energy_return_time'])
                                            : null,
                                        drc_phase_a: value['drc_phase_a']
                                            ? Number(value['drc_phase_a'])
                                            : null,
                                        drc_phase_b: value['drc_phase_b']
                                            ? Number(value['drc_phase_b'])
                                            : null,
                                        drc_phase_c: value['drc_phase_c']
                                            ? Number(value['drc_phase_c'])
                                            : null,
                                        drp_phase_a: value['drp_phase_a']
                                            ? Number(value['drp_phase_a'])
                                            : null,
                                        drp_phase_b: value['drp_phase_b']
                                            ? Number(value['drp_phase_b'])
                                            : null,
                                        drp_phase_c: value['drp_phase_c']
                                            ? Number(value['drp_phase_c'])
                                            : null,
                                        quality_interval_start: value['quality_interval_start']
                                            ? Number(value['quality_interval_start'])
                                            : null,
                                        quality_interval_end: value['quality_interval_end']
                                            ? Number(value['quality_interval_end'])
                                            : null,
                                        consumed_total_energy: value['consumed_total_energy']
                                            ? Number(value['consumed_total_energy'])
                                            : null,
                                        generated_total_energy: value['generated_total_energy']
                                            ? Number(value['generated_total_energy'])
                                            : null,
                                        capacitive_total_energy: value['capacitive_total_energy']
                                            ? Number(value['capacitive_total_energy'])
                                            : null,
                                        inductive_total_energy: value['inductive_total_energy']
                                            ? Number(value['inductive_total_energy'])
                                            : null,
                                        frequency: value['frequency']
                                            ? Number(value['frequency'])
                                            : null,
                                        current_phase_a: value['current_phase_a']
                                            ? Number(value['current_phase_a'])
                                            : null,
                                        current_phase_b: value['current_phase_b']
                                            ? Number(value['current_phase_b'])
                                            : null,
                                        current_phase_c: value['current_phase_c']
                                            ? Number(value['current_phase_c'])
                                            : null,
                                        relay_out: value['relay_out']
                                            ? Number(value['relay_out'])
                                            : null,
                                        active_power_phase_a: value['active_power_phase_a']
                                            ? Number(value['active_power_phase_a'])
                                            : null,
                                        active_power_phase_b: value['active_power_phase_b']
                                            ? Number(value['active_power_phase_b'])
                                            : null,
                                        active_power_phase_c: value['active_power_phase_c']
                                            ? Number(value['active_power_phase_c'])
                                            : null,
                                        power_factor_phase_a: value['power_factor_phase_a']
                                            ? Number(value['power_factor_phase_a'])
                                            : null,
                                        power_factor_phase_b: value['power_factor_phase_b']
                                            ? Number(value['power_factor_phase_b'])
                                            : null,
                                        power_factor_phase_c: value['power_factor_phase_c']
                                            ? Number(value['power_factor_phase_c'])
                                            : null,
                                        reative_power_phase_a: value['reative_power_phase_a']
                                            ? Number(value['reative_power_phase_a'])
                                            : null,
                                        reative_power_phase_b: value['reative_power_phase_b']
                                            ? Number(value['reative_power_phase_b'])
                                            : null,
                                        reative_power_phase_c: value['reative_power_phase_c']
                                            ? Number(value['reative_power_phase_c'])
                                            : null,
                                        apparent_power_phase_a: value['apparent_power_phase_a']
                                            ? Number(value['apparent_power_phase_a'])
                                            : null,
                                        apparent_power_phase_b: value['apparent_power_phase_b']
                                            ? Number(value['apparent_power_phase_b'])
                                            : null,
                                        apparent_power_phase_c: value['apparent_power_phase_c']
                                            ? Number(value['apparent_power_phase_c'])
                                            : null,
                                        voltage_phase_a: value['voltage_phase_a']
                                            ? Number(value['voltage_phase_a'])
                                            : null,
                                        voltage_phase_b: value['voltage_phase_b']
                                            ? Number(value['voltage_phase_b'])
                                            : null,
                                        voltage_phase_c: value['voltage_phase_c']
                                            ? Number(value['voltage_phase_c'])
                                            : null,
                                        cable_status: value['cable_status']
                                            ? Number(value['cable_status'])
                                            : null,
                                    },
                                },
                            };
                            toInsert.push(payloadToInsert);
                        }
                        if (toInsert.length === 2000) {
                            await writeInInflux(newDevice, toInsert);
                            toInsert = [];
                        }
                    }
                    if (toInsert.length > 0) {
                        await writeInInflux(newDevice, toInsert);
                    }
                    resolve(void 0);
                });
                stream.on('error', function (error) {
                    reject(error);
                });
            });
        };
    }
    async writeInInflux(newDevice, allPoints) {
        const bucket = await this.influxBucketsService.findOne(newDevice.bucketId);
        const influxConnection = await this.influxConnectionsService.findOne(bucket.influxConnectionId);
        const client = new influxdb_client_1.InfluxDB({
            url: influxConnection.host,
            token: influxConnection.apiToken,
        });
        const writeApi = client.getWriteApi(influxConnection.orgId, bucket.name, 'ms');
        const points = allPoints.map((data) => {
            const point = new influxdb_client_1.Point(data.measurement);
            Object.keys(data.tags).forEach((tag) => {
                point.tag(tag, data.tags[tag]);
            });
            Object.keys(data.fields).forEach((dataType) => {
                if (dataType === 'integer') {
                    Object.keys(data.fields[dataType]).forEach((field) => {
                        if (data.fields[dataType][field] ||
                            data.fields[dataType][field] == 0) {
                            point.intField(field, data.fields[dataType][field]);
                        }
                    });
                }
                else if (dataType === 'float') {
                    Object.keys(data.fields[dataType]).forEach((field) => {
                        if (data.fields[dataType][field] ||
                            data.fields[dataType][field] == 0) {
                            point.floatField(field, data.fields[dataType][field]);
                        }
                    });
                }
                else if (dataType === 'string') {
                    Object.keys(data.fields[dataType]).forEach((field) => {
                        if (data.fields[dataType][field]) {
                            point.stringField(field, data.fields[dataType][field]);
                        }
                    });
                }
            });
            if (data.time) {
                point.timestamp(new Date(data.time));
            }
            return point;
        });
        return await new Promise((resolve, reject) => {
            writeApi.writePoints(points);
            writeApi
                .close()
                .then(() => {
                resolve(void 0);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
};
__decorate([
    (0, decorators_1.OnEvent)(constants_1.SETTINGS_ALL, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesGbService.prototype, "saveDevicesInCache", null);
DevicesGbService = DevicesGbService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, mongoose_2.InjectConnection)()),
    __param(6, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [devices_gb_repository_1.DevicesGbRepository,
        influx_service_1.InfluxService,
        influx_connections_service_1.InfluxConnectionsService,
        notification_service_1.NotificationService,
        influx_buckets_service_1.InfluxBucketsService, mongoose_1.default.Connection, Object])
], DevicesGbService);
exports.DevicesGbService = DevicesGbService;
//# sourceMappingURL=devices-gb.service.js.map