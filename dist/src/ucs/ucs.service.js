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
exports.UcsService = void 0;
const common_1 = require("@nestjs/common");
const utmObj = require('utm-latlng');
const geo_tz_1 = require("geo-tz");
const ucs_repository_1 = require("./ucs.repository");
const papaparse_1 = require("papaparse");
const transformers_service_1 = require("../transformers/transformers.service");
const clients_service_1 = require("../clients/clients.service");
const Role_1 = require("../auth/models/Role");
const mongoose_1 = require("mongoose");
const devices_gb_service_1 = require("../devices-gb/devices-gb.service");
const notification_service_1 = require("../notification/notification.service");
const influx_buckets_service_1 = require("../influx-buckets/influx-buckets.service");
const users_service_1 = require("../users/users.service");
const utils_1 = require("../utils/utils");
const filterHandler_1 = require("../utils/filterHandler");
const ucdisabled_history_service_1 = require("../ucdisabled-history/ucdisabled-history.service");
const mongoose_2 = require("@nestjs/mongoose");
const ttn_service_1 = require("../common/services/ttn.service");
const fields = [
    'clientId.name',
    'transformerId.it',
    'ucCode',
    'ucNumber',
    'phases',
    'routeCode',
];
let UcsService = class UcsService {
    constructor(ucRepository, usersService, transformersService, clientsService, devicesGbService, ucDisabledHistoryService, influxBucketsService, notificationService, connection, cacheService) {
        this.ucRepository = ucRepository;
        this.usersService = usersService;
        this.transformersService = transformersService;
        this.clientsService = clientsService;
        this.devicesGbService = devicesGbService;
        this.ucDisabledHistoryService = ucDisabledHistoryService;
        this.influxBucketsService = influxBucketsService;
        this.notificationService = notificationService;
        this.connection = connection;
        this.cacheService = cacheService;
        this.applyPaginationClientFilterByRole = ({ currentUser }) => {
            const newFilter = [];
            const isAdminOrSupport = [Role_1.Role.SUPER_ADMIN, Role_1.Role.SUPPORT].includes(currentUser.accessLevel);
            if (isAdminOrSupport) {
                return newFilter;
            }
            newFilter.push({
                'clientId._id': currentUser.clientId,
            });
            return newFilter;
        };
    }
    async create(createUcDto, currentUser) {
        const countDevice = createUcDto.deviceId
            ? await this.ucRepository.countByDeviceId(createUcDto.deviceId.toString())
            : 0;
        if (countDevice) {
            throw new common_1.ConflictException('O dispositivo já está em uma UC.');
        }
        if (!createUcDto.deviceId) {
            delete createUcDto.deviceId;
        }
        const location = createUcDto.longitude !== undefined && createUcDto.latitude !== undefined
            ? {
                type: 'Point',
                coordinates: [createUcDto.longitude, createUcDto.latitude],
            }
            : null;
        const clientId = createUcDto.clientId || currentUser.clientId;
        return await this.ucRepository.create({
            ...createUcDto,
            location,
            clientId,
            timeZone: (0, geo_tz_1.find)(createUcDto.latitude, createUcDto.longitude)[0],
            isCutted: false,
        });
    }
    async _extractUcs(file) {
        return (0, papaparse_1.parse)(file.buffer.toString(), {
            header: true,
            skipEmptyLines: true,
            complete: (results) => results.data,
        }).data;
    }
    async _convertUtmToLatLng(lat, long, fuso) {
        const utm = new utmObj();
        const fusoSplit = fuso.split(/([0-9]+)/);
        const coordinates = await utm.convertUtmToLatLng(Number(lat.replace(',', '.')), Number(long.replace(',', '.')), fusoSplit[1], fusoSplit[2]);
        return coordinates || null;
    }
    async processCSV(file, clientId, isAdmin, userId) {
        if (!isAdmin) {
            const user = await this.usersService.findOne(userId);
            clientId = user.clientId;
        }
        const csvData = await this._extractUcs(file);
        return await Promise.all(csvData.map(async (data) => {
            const coordinates = await this._convertUtmToLatLng(data.COORDENADAX, data.COORDENADAY, data.FUSO);
            const location = coordinates
                ? {
                    type: 'Point',
                    coordinates: [coordinates.lng, coordinates.lat],
                }
                : null;
            const transformer = await this.transformersService.findByIt(data.TR);
            return {
                clientId,
                transformerId: transformer?._id.toString() || null,
                ucCode: data.IDUC,
                transformer: data.TR,
                location,
                ucNumber: data.NR_MEDIDOR_KWH,
                ucClass: data.CLASSE,
                subClass: data.SUBCLASSE,
                billingGroup: Number(data.IDGRUPOFAT),
                group: data.GRUPO,
                routeCode: Number(data.IDROTA),
                timeZone: coordinates
                    ? (0, geo_tz_1.find)(coordinates.lat, coordinates.lng)[0]
                    : null,
                sequence: data.SEQUENCIA_LEIT,
                phases: data.FASE,
                circuitBreaker: Number(data.DISJUNTOR),
                microgeneration: data.MICRO_GERACAO !== 'N',
                district: data.BAIRRO,
                city: data.CIDADE,
                subGroup: data.SUBGRUPO_FAT,
            };
        }));
    }
    async findClientsIds(currentUser, query) {
        const { clientId } = query;
        if (currentUser.accessLevel === Role_1.Role.SUPER_ADMIN ||
            currentUser.accessLevel === Role_1.Role.SUPPORT) {
            if (clientId) {
                return [clientId];
            }
            else {
                const clients = await this.clientsService.findWhere({
                    active: true,
                });
                return clients.map((client) => client._id.toString());
            }
        }
        else {
            return [currentUser.clientId];
        }
    }
    async findDevices(accessLevel, query, clientsIds) {
        let devices;
        const { deviceType } = query;
        if (deviceType) {
            if (accessLevel === Role_1.Role.SUPER_ADMIN || accessLevel === Role_1.Role.SUPPORT) {
                devices = await this.devicesGbService.findWhere({
                    type: deviceType,
                });
            }
            else {
                devices = await this.devicesGbService.findWhere({
                    clientId: { $in: clientsIds },
                    type: deviceType,
                });
            }
        }
        else {
            if (accessLevel === Role_1.Role.SUPER_ADMIN || accessLevel === Role_1.Role.SUPPORT) {
                devices = await this.devicesGbService.findWhere({});
            }
            else {
                devices = await this.devicesGbService.findWhere({
                    clientId: { $in: clientsIds },
                });
            }
        }
        return devices;
    }
    async findPaginated(currentUser, query) {
        const { clientId, searchText, skip, limit, sort, filter = [] } = query;
        const filterByRoleAccess = this.applyPaginationClientFilterByRole({
            currentUser,
        });
        filter.push(...filterByRoleAccess);
        let generalWhereClause = {};
        const convertedSort = sort ? (0, utils_1.convertPropertiesToInt)(sort) : { it: 1 };
        const data = [{ $sort: convertedSort }];
        if (skip) {
            data.push({ $skip: Number(skip) });
        }
        if (limit) {
            data.push({ $limit: Number(limit) });
        }
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
        const findDeviceIdIndex = (filter || []).findIndex((filter) => filter['deviceId.devId']);
        let deviceSituation;
        if (findDeviceIdIndex > -1) {
            deviceSituation = filter[findDeviceIdIndex]['deviceId.devId'][0];
            if (deviceSituation === 'Ativada') {
                filter[findDeviceIdIndex]['deviceId.devId'] = '^(?!ucd)';
            }
            if (deviceSituation === 'Desativada') {
                filter[findDeviceIdIndex]['deviceId.devId'] = '^ucd';
            }
        }
        const generalFilters = (0, filterHandler_1.handleFilters)(filter);
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
        if (deviceSituation && deviceSituation === 'Ativada') {
            generalWhereClause = {
                $or: [
                    {
                        deviceId: null,
                    },
                    generalWhereClause,
                ],
            };
        }
        return this.ucRepository.findPaginated(generalWhereClause, data);
    }
    async findAll(currentUser, query) {
        let clientsIds = [];
        const { clientId, deviceType, allows, transformerId } = query;
        if (currentUser.accessLevel === 'admin' ||
            currentUser.accessLevel === 'support') {
            if (clientId) {
                clientsIds = [clientId];
            }
            else {
                const clients = await this.clientsService.findWhere({ active: true });
                clients.forEach((client) => {
                    clientsIds.push(client._id);
                });
            }
        }
        else {
            clientsIds = [currentUser.clientId];
        }
        let ucs;
        if (deviceType || allows) {
            let devices;
            if (deviceType) {
                if (currentUser.accessLevel === 'admin' ||
                    currentUser.accessLevel === 'support') {
                    devices = await this.devicesGbService.findWhere({ type: deviceType });
                }
                else {
                    devices = await this.devicesGbService.findWhere({
                        type: deviceType,
                        clientId: { $in: clientsIds },
                    });
                }
            }
            else {
                if (currentUser.accessLevel === 'admin' ||
                    currentUser.accessLevel === 'support') {
                    devices = await this.devicesGbService.findWhere({});
                }
                else {
                    devices = await this.devicesGbService.findWhere({
                        clientId: { $in: clientsIds },
                    });
                }
            }
            const devicesIds = [];
            for await (const item of devices) {
                devicesIds.push(item._id);
            }
            ucs = await this.ucRepository.find({
                deviceId: { $in: devicesIds },
            });
            if (allows) {
                const filteredUcs = [];
                for await (const uc of ucs) {
                    const found = devices.find(function (device) {
                        return (device.allows.some((item) => item == allows) &&
                            String(device._id) == String(uc.deviceId._id));
                    });
                    if (found) {
                        filteredUcs.push(uc);
                    }
                }
                return filteredUcs;
            }
            else {
                return ucs;
            }
        }
        else {
            if (transformerId) {
                if (typeof transformerId === 'object') {
                    ucs = await this.ucRepository.findAndPopulate({
                        deviceId: { $ne: null },
                        clientId: { $in: clientsIds },
                        transformerId: { $in: transformerId },
                    }, [
                        'deviceId',
                        'transformerId',
                        'clientId',
                        'lastReceived',
                        'settings',
                    ]);
                }
                else {
                    ucs = await this.ucRepository.findAndPopulate({
                        deviceId: { $ne: null },
                        clientId: { $in: clientsIds },
                        transformerId: transformerId,
                    }, [
                        'deviceId',
                        'transformerId',
                        'clientId',
                        'lastReceived',
                        'settings',
                    ]);
                }
            }
            else {
                ucs = await this.ucRepository.findAndPopulate({ clientId: { $in: clientsIds } }, ['deviceId', 'transformerId', 'clientId', 'lastReceived', 'settings']);
            }
            return ucs;
        }
    }
    async findById(_id) {
        return await this.ucRepository.findOne({ _id });
    }
    findByIdPopulate(id, populate = ['deviceId', 'lastReceived', 'settings']) {
        return this.ucRepository.findByIdWithPopulate({ _id: id }, populate);
    }
    findWhere(where, projection) {
        return this.ucRepository.findWithPopulate(where, projection);
    }
    findWhereDetails(where, projection) {
        return this.ucRepository.findWithOnePopulate(where, projection);
    }
    findByUcCode(ucCode) {
        return this.ucRepository.findOne({ ucCode });
    }
    async update(id, updateUcDto, currentUser) {
        const numberOfDevices = updateUcDto.deviceId
            ? await this.ucRepository.countByUcByDeviceId(updateUcDto.deviceId.toString(), id)
            : 0;
        if (numberOfDevices) {
            throw new common_1.ConflictException('O dispositivo já está em uma UC.');
        }
        const location = updateUcDto.longitude !== undefined && updateUcDto.latitude !== undefined
            ? {
                type: 'Point',
                coordinates: [updateUcDto.longitude, updateUcDto.latitude],
            }
            : null;
        const clientId = updateUcDto.clientId || new mongoose_1.Types.ObjectId(currentUser.id);
        const uc = await this.ucRepository.findOne({ _id: id });
        const updated = await this.ucRepository.findOneAndUpdate({ _id: id }, {
            ...updateUcDto,
            location,
            clientId,
            timeZone: (0, geo_tz_1.find)(updateUcDto.latitude, updateUcDto.longitude)[0],
        });
        if (uc.deviceId) {
            const device = await this.devicesGbService.findOne(uc.deviceId);
            await this.cacheService.del(`remota:${device.devId}`);
        }
        if (updated.deviceId) {
            const device = await this.devicesGbService.findOne(updated.deviceId);
            await this.cacheService.del(`remota:${device.devId}`);
        }
        return updated;
    }
    async changeDevice({ id, deviceId, deleteData = false, user, }) {
        const uc = await this.ucRepository.findWithOnePopulate({
            _id: id,
        });
        if (uc.deviceId._id == deviceId) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Não foi possível alterar. Dispositivos precisam ser diferentes.',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const newDevice = await this.devicesGbService.findByIdPopulate(deviceId, [
            'bucketId',
            'applicationId',
        ]);
        const application = newDevice.applicationId;
        let newDevEui;
        try {
            newDevEui =
                newDevice.type === 'LoRa'
                    ? await ttn_service_1.TtnService.get(`applications/${application.appId}/devices/${newDevice.devId}`)
                    : null;
        }
        catch (err) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Ocorreu um erro durante a troca de dispositivos. Entre em contato com o suporte',
                stacktrace: err.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: err,
            });
        }
        const oldDevice = await this.devicesGbService.findByIdPopulate(uc.deviceId._id, ['bucketId', 'applicationId']);
        if (!newDevice) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Não foi possível alterar. Novo dispositivo não foi encontrado.',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!oldDevice) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Não foi possível alterar. Antigo dispositivo não foi encontrado.',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const transactionSession = await this.connection.startSession();
        transactionSession.startTransaction();
        try {
            await this.devicesGbService.migrateDevice({
                oldDevice,
                newDevice,
                hardwareSerial: newDevEui && newDevEui.data ? newDevEui.data.ids.dev_eui : null,
                deleteOldData: deleteData,
                uc,
                transactionSession,
            });
        }
        catch (err) {
            const oldClientId = oldDevice.clientId.toString();
            const message = uc
                ? `Ocorreu um erro durante a troca de dispositivos da UC ${uc.ucCode}. Entre em contato com o suporte`
                : `Ocorreu um erro durante a troca de dispositivos ${oldDevice.devId} e ${newDevice.devId}. Entre em contato com o suporte`;
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
        const message = `A troca de dispositivos da UC ${uc.ucCode} foi finalizada com sucesso!`;
        await this.notificationService.create({
            clientId: oldDevice.clientId.toString(),
            title: `Troca de dispositivos bem sucedida!`,
            message,
            createdAt: new Date(),
        });
        await transactionSession.commitTransaction();
        transactionSession.endSession();
    }
    async disable(id, deleteData = false, user) {
        const transactionSession = await this.connection.startSession();
        transactionSession.startTransaction();
        const uc = await this.ucRepository.findWithOnePopulate({
            _id: id,
        });
        const oldDevice = await this.devicesGbService.findByIdPopulate(uc.deviceId._id, ['bucketId', 'applicationId']);
        if (!oldDevice || !oldDevice.clientId) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Não foi possível desabilitar. Dispositivo não encontrado.',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const oldClientId = oldDevice.clientId.toString();
        const createUcDisabledHistoryDto = {
            clientId: uc.clientId?.name,
            ucCode: uc.ucCode,
            devId: uc.deviceId.devId,
            dataDeleted: deleteData,
            user: user.username,
            date: new Date(),
        };
        try {
            if (!uc.deviceId) {
                const bucket = await this.influxBucketsService.findOneWhere({
                    clientId: uc.clientId,
                });
                if (!bucket) {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.BAD_REQUEST,
                        message: 'Bucket não encontrado',
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
                const bucketId = bucket._id.toString();
                const device = {
                    clientId: uc.clientId,
                    devId: `ucd-${uc.ucCode}`,
                    name: `UC ${uc.ucCode} desativada`,
                    allows: [],
                    bucketId,
                };
                await this.devicesGbService
                    .create(device, transactionSession)
                    .then(async (response) => {
                    await this.ucRepository.findByIdAndUpdate(uc._id, {
                        deviceId: response._id,
                    });
                })
                    .catch((error) => {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.BAD_REQUEST,
                        message: 'Erro ao criar device',
                    }, common_1.HttpStatus.BAD_REQUEST, {
                        cause: error,
                    });
                });
                return;
            }
            if (uc.deviceId.devId === `ucd-${uc.ucCode}`) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Não foi possível desabilitar. Dispositivo já está desativado.',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const oldBucketId = oldDevice.bucketId._id.toString();
            const device = {
                clientId: oldClientId,
                devId: `ucd-${uc.ucCode}`,
                bucketId: oldBucketId,
                name: `UC ${uc.ucCode} desativada`,
                allows: oldDevice.allows,
                communication: 'PIMA',
                type: 'LoRa',
                databaseId: new mongoose_1.Types.ObjectId().toString(),
            };
            const newDevice = await this.devicesGbService.create(device, transactionSession);
            await this.devicesGbService.migrateDevice({
                oldDevice,
                newDevice,
                hardwareSerial: null,
                deleteOldData: deleteData,
                uc,
                transactionSession,
            });
        }
        catch (err) {
            const message = uc
                ? `Ocorreu um erro durante a troca de dispositivos da UC ${uc.ucCode}.Entre em contato com o suporte`
                : `Ocorreu um erro durante a troca de dados entre os dispositivos ${oldDevice.devId}. Entre em contato com o suporte`;
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
        const message = `A troca de dispositivos da UC ${uc.ucCode} foi finalizada com sucesso!`;
        await this.notificationService.create({
            clientId: oldDevice.clientId.toString(),
            title: `Troca de dispositivos bem sucedida!`,
            message,
            createdAt: new Date(),
        });
        await this.ucDisabledHistoryService.create(createUcDisabledHistoryDto, transactionSession);
        await transactionSession.commitTransaction();
        transactionSession.endSession();
    }
    findByUcCodesPopulate(ucCodes) {
        return this.ucRepository.findWithPopulate({ ucCode: { $in: ucCodes } });
    }
    updateByUcCodeOrInsert(ucs) {
        return Promise.all(ucs.map(async (uc) => this.ucRepository.upsert({ ucCode: uc.ucCode }, uc)));
    }
    async removeOne(id) {
        return this.ucRepository.delete(id);
    }
    async removeMany(ids) {
        return this.ucRepository.deleteMany(ids);
    }
};
UcsService = __decorate([
    (0, common_1.Injectable)(),
    __param(8, (0, mongoose_2.InjectConnection)()),
    __param(9, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [ucs_repository_1.UcsRepository,
        users_service_1.UsersService,
        transformers_service_1.TransformersService,
        clients_service_1.ClientsService,
        devices_gb_service_1.DevicesGbService,
        ucdisabled_history_service_1.UcdisabledHistoryService,
        influx_buckets_service_1.InfluxBucketsService,
        notification_service_1.NotificationService, mongoose_1.default.Connection, Object])
], UcsService);
exports.UcsService = UcsService;
//# sourceMappingURL=ucs.service.js.map