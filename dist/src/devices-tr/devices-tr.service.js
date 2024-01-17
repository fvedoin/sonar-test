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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesTrService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const devices_tr_repository_1 = require("./devices-tr.repository");
const transformers_service_1 = require("../transformers/transformers.service");
const CSVfields_map_1 = require("../utils/CSVfields-map");
const influx_service_1 = require("../influx/influx.service");
const influx_buckets_service_1 = require("../influx-buckets/influx-buckets.service");
const influx_connections_service_1 = require("../influx-connections/influx-connections.service");
let DevicesTrService = class DevicesTrService {
    constructor(deviceTrRepository, transformerService, influxService, influxBucketService, influxConnectionService) {
        this.deviceTrRepository = deviceTrRepository;
        this.transformerService = transformerService;
        this.influxService = influxService;
        this.influxBucketService = influxBucketService;
        this.influxConnectionService = influxConnectionService;
    }
    async getAnalytics(query) {
        const { trsIds, dateRange, fields } = query;
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        const transformers = await this.transformerService.findWhereAndPopulate({ _id: { $in: trsIds } }, ['smartTrafoDeviceId']);
        const header = ['Tempo', 'IT'].concat(fields);
        const response = [['Data', 'Hora'].concat(header)];
        if (!transformers.length)
            return response;
        if (!transformers[0].smartTrafoDeviceId)
            return response;
        const smartTrafoDevice = transformers[0]
            .smartTrafoDeviceId;
        if (!smartTrafoDevice.bucketId) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Não há bucket vinculado',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const bucket = await this.influxBucketService.findOne(smartTrafoDevice.bucketId);
        if (!bucket) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Não há bucket cadastrado',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const influxConnection = await this.influxConnectionService.findOne(bucket.influxConnectionId);
        const devsIds = transformers.map((item) => `r["dev_id"] == "${item.smartTrafoDeviceId.devId}"`);
        const queryFields = fields.map((item) => `r["_field"] == "${item}"`);
        const data = await this.influxService.findAnalyticsFieldData({
            fields: queryFields.join(' or '),
            devsIds: devsIds.join(' or '),
            begin: Math.round(new Date(start).getTime() / 1000),
            end: new Date(end).getTime() <= new Date().getTime()
                ? Math.round(new Date(end).getTime() / 1000)
                : Math.round(new Date().getTime() / 1000),
            host: influxConnection.host,
            apiToken: influxConnection.apiToken,
            bucket: bucket.name,
        });
        header.shift();
        for await (const item of data) {
            const newLine = [
                new Date(item._time).toLocaleDateString('pt-Br', {
                    dateStyle: 'short',
                    timeZone: 'America/Sao_Paulo',
                }),
                new Date(item._time).toLocaleTimeString('pt-Br', {
                    timeStyle: 'medium',
                    timeZone: 'America/Sao_Paulo',
                }),
                null,
            ];
            fields.forEach((field) => {
                if (item[field] || typeof item[field] === 'number') {
                    if (typeof item[field] === 'number') {
                        newLine.push(new Intl.NumberFormat('pt-BR', {
                            style: 'decimal',
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                        })
                            .format(item[field])
                            .replace('.', ','));
                    }
                    else {
                        newLine.push(item[field]);
                    }
                }
                else {
                    newLine.push(null);
                }
            });
            response.push(newLine);
        }
        response[0] = response[0].map((item) => CSVfields_map_1.measurements.find((measurement) => measurement.value === item)
            ? CSVfields_map_1.measurements.find((measurement) => measurement.value === item).label
            : item);
        return response;
    }
    findWhere(whereClause) {
        return this.deviceTrRepository.aggregate([
            {
                $match: whereClause,
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'client',
                },
            },
            {
                $unwind: {
                    path: '$client',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'transformers',
                    localField: '_id',
                    foreignField: 'smartTrafoDeviceId',
                    as: 'transformers',
                },
            },
            {
                $unwind: {
                    path: '$transformers',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'lastreceivedssmarttrafos',
                    localField: '_id',
                    foreignField: 'deviceId',
                    as: 'lastreceivedssmarttrafos',
                },
            },
            {
                $unwind: {
                    path: '$lastreceivedssmarttrafos',
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
                $lookup: {
                    from: 'brokerattributes',
                    localField: 'devId',
                    foreignField: 'devId',
                    pipeline: [
                        {
                            $match: {
                                devId: { $exists: true, $ne: null },
                            },
                        },
                    ],
                    as: 'mqttAccess',
                },
            },
            {
                $unwind: {
                    path: '$mqttAccess',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    client: { $first: '$client' },
                    lastReceiveds: { $push: '$lastreceivedssmarttrafos' },
                    transformers: { $first: '$transformers' },
                    settings: { $first: '$settings' },
                    devId: { $first: '$devId' },
                    type: { $first: '$type' },
                    online: { $first: '$online' },
                    name: { $first: '$name' },
                    city: { $first: '$city' },
                    district: { $first: '$district' },
                    location: { $first: '$location' },
                    mqttAccess: { $first: '$mqttAccess' },
                },
            },
            {
                $project: {
                    _id: 1,
                    client: 1,
                    lastReceiveds: 1,
                    transformers: 1,
                    settings: 1,
                    devId: 1,
                    type: 1,
                    online: 1,
                    name: 1,
                    city: 1,
                    district: 1,
                    location: 1,
                    mqttAccess: 1,
                },
            },
        ]);
    }
    findFilteredDevicesTr(user) {
        const isAdmin = user.accessLevel === 'admin';
        const isOrgAdmin = user.accessLevel === 'commercial';
        if (isAdmin) {
            return this.handleAdminRoute();
        }
        else if (isOrgAdmin) {
            return this.handleOrgAdminRoute(user);
        }
        return this.handleNonAdminRoute(user);
    }
    handleAdminRoute() {
        const whereClause = {};
        return this.findWhere(whereClause);
    }
    handleNonAdminRoute(user) {
        const clientId = new mongoose_1.Types.ObjectId(user.clientId);
        return this.findWhere({ clientId });
    }
    async handleOrgAdminRoute(user) {
        const { clientId } = user;
        const childClients = await this.deviceTrRepository.findChildClients(clientId);
        const clientIdsToSearch = [
            clientId,
            ...childClients.map((item) => item._id),
        ];
        const devices = await this.findWhere({
            clientId: { $in: clientIdsToSearch },
        });
        return devices;
    }
    findTelikTrafoLiteDevices(user) {
        const isAdmin = user.accessLevel === 'admin';
        const isOrgAdmin = user.accessLevel === 'commercial';
        if (isAdmin) {
            return this.handleAdminRouteForTelikTrafoLite();
        }
        else if (isOrgAdmin) {
            return this.handleOrgAdminRouteForTelikTrafoLite(user);
        }
        return this.handleNonAdminRouteForTelikTrafoLite(user);
    }
    handleAdminRouteForTelikTrafoLite() {
        const whereClause = {
            type: 'Telik Trafo Lite',
        };
        return this.findWhere(whereClause);
    }
    handleNonAdminRouteForTelikTrafoLite(user) {
        const whereClause = {
            type: 'Telik Trafo Lite',
            clientId: new mongoose_1.Types.ObjectId(user.clientId),
        };
        return this.findWhere(whereClause);
    }
    async handleOrgAdminRouteForTelikTrafoLite(user) {
        const { clientId } = user;
        const childClients = await this.deviceTrRepository.findChildClients(clientId);
        const clientIdsToSearch = [
            clientId,
            ...childClients.map((item) => item._id),
        ];
        const whereClause = {
            clientId: { $in: clientIdsToSearch },
            type: 'Telik Trafo Lite',
        };
        const devices = await this.findWhere(whereClause);
        return devices;
    }
    findFilteredTransformerTelikTrafoLite(user, clientId) {
        const isAdmin = user.accessLevel === 'admin';
        const isOrgAdmin = user.accessLevel === 'orgadmin';
        if (isAdmin) {
            return this.handleAdminRouteForFiltered(clientId);
        }
        else if (isOrgAdmin) {
            return this.handleOrgAdminRouteForFiltered(clientId);
        }
        return this.handleNonAdminRouteForFiltered(user);
    }
    handleAdminRouteForFiltered(clientId) {
        const whereClause = {
            type: 'Telik Trafo Lite',
            clientId: new mongoose_1.Types.ObjectId(clientId),
        };
        return this.findWhere(whereClause);
    }
    async handleOrgAdminRouteForFiltered(clientId) {
        const childClients = await this.deviceTrRepository.findChildClients(clientId);
        const clientIdsToSearch = [
            clientId,
            ...childClients.map((item) => item._id),
        ];
        const whereClause = {
            clientId: { $in: clientIdsToSearch },
            type: 'Telik Trafo Lite',
        };
        const devices = await this.findWhere(whereClause);
        return devices;
    }
    handleNonAdminRouteForFiltered(user) {
        const whereClause = {
            type: 'Telik Trafo Lite',
            clientId: new mongoose_1.Types.ObjectId(user.clientId),
        };
        return this.findWhere(whereClause);
    }
    findFilteredTransformerDevices(user, clientId) {
        const isAdmin = user.accessLevel === 'admin';
        const isOrgAdmin = user.accessLevel === 'orgadmin';
        if (isAdmin) {
            return this.handleAdminRouteForFilteredDevices(clientId);
        }
        else if (isOrgAdmin) {
            return this.handleOrgAdminRouteForFilteredDevices(clientId);
        }
        return this.handleNonAdminRouteForFilteredDevices(user);
    }
    handleAdminRouteForFilteredDevices(clientId) {
        const whereClause = {
            clientId: new mongoose_1.Types.ObjectId(clientId),
        };
        return this.findWhere(whereClause);
    }
    async handleOrgAdminRouteForFilteredDevices(clientId) {
        const childClients = await this.deviceTrRepository.findChildClients(clientId);
        const clientIdsToSearch = [
            clientId,
            ...childClients.map((item) => item._id),
        ];
        const whereClause = {
            clientId: { $in: clientIdsToSearch },
        };
        const devices = await this.findWhere(whereClause);
        return devices;
    }
    handleNonAdminRouteForFilteredDevices(user) {
        const whereClause = {
            clientId: new mongoose_1.Types.ObjectId(user.clientId),
        };
        return this.findWhere(whereClause);
    }
    findOne(id) {
        return this.deviceTrRepository.findOne({ _id: id });
    }
    remove(ids) {
        return this.deviceTrRepository.deleteMany({ _id: { $in: ids } });
    }
};
DevicesTrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [devices_tr_repository_1.DevicesTrRepository,
        transformers_service_1.TransformersService,
        influx_service_1.InfluxService,
        influx_buckets_service_1.InfluxBucketsService,
        influx_connections_service_1.InfluxConnectionsService])
], DevicesTrService);
exports.DevicesTrService = DevicesTrService;
//# sourceMappingURL=devices-tr.service.js.map