"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ucs_controller_1 = require("../ucs.controller");
const ucs_service_1 = require("../ucs.service");
const ucDto_stub_1 = require("../stubs/ucDto.stub");
const currentUser_stub_1 = require("../stubs/currentUser.stub");
const uc_stub_1 = require("../stubs/uc.stub");
const ucs_repository_1 = require("../ucs.repository");
const transformers_service_1 = require("../../transformers/transformers.service");
const clients_service_1 = require("../../clients/clients.service");
const devices_gb_service_1 = require("../../devices-gb/devices-gb.service");
const notification_service_1 = require("../../notification/notification.service");
const users_service_1 = require("../../users/users.service");
const influx_buckets_service_1 = require("../../influx-buckets/influx-buckets.service");
const deviceGB_stub_1 = require("../stubs/deviceGB.stub");
const ucdisabled_history_service_1 = require("../../ucdisabled-history/ucdisabled-history.service");
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
jest.mock('../ucs.repository');
jest.mock('src/ucs/__mocks__/devices-gb.repository.ts');
jest.mock('src/transformers/transformers.service');
jest.mock('src/users/users.service');
jest.mock('src/clients/clients.service');
jest.mock('src/notification/notification.service');
jest.mock('src/influx-buckets/influx-buckets.service');
jest.mock('src/ucdisabled-history/ucdisabled-history.service');
const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
};
describe('UcsService', () => {
    let service;
    let repository;
    let transformersService;
    let clientsService;
    let devicesGbService;
    let ucDisabledHistoryService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [ucs_controller_1.UcsController],
            providers: [
                ucs_service_1.UcsService,
                ucs_repository_1.UcsRepository,
                transformers_service_1.TransformersService,
                clients_service_1.ClientsService,
                users_service_1.UsersService,
                {
                    provide: devices_gb_service_1.DevicesGbService,
                    useValue: {
                        findByIdPopulate: jest.fn().mockResolvedValue((0, deviceGB_stub_1.deviceGBStub)()),
                        create: jest.fn().mockResolvedValue((0, deviceGB_stub_1.deviceGBStub)()),
                        findOne: jest.fn().mockResolvedValue((0, deviceGB_stub_1.deviceGBStub)()),
                        migrateDevice: jest.fn(),
                    },
                },
                notification_service_1.NotificationService,
                influx_buckets_service_1.InfluxBucketsService,
                ucdisabled_history_service_1.UcdisabledHistoryService,
                {
                    provide: (0, mongoose_1.getConnectionToken)('Database'),
                    useValue: {
                        startSession: jest.fn().mockReturnValue(mockSession),
                    },
                },
                {
                    provide: common_1.CACHE_MANAGER,
                    useFactory: jest.fn(),
                    useValue: { del: jest.fn(), set: jest.fn() },
                },
                {
                    provide: common_1.CACHE_MANAGER,
                    useValue: {
                        del: jest.fn(),
                    },
                },
            ],
        }).compile();
        service = module.get(ucs_service_1.UcsService);
        repository = module.get(ucs_repository_1.UcsRepository);
        transformersService = module.get(transformers_service_1.TransformersService);
        clientsService = module.get(clients_service_1.ClientsService);
        devicesGbService = module.get(devices_gb_service_1.DevicesGbService);
        ucDisabledHistoryService = module.get(ucdisabled_history_service_1.UcdisabledHistoryService);
        jest.clearAllMocks();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    it('should be defined transformersService', () => {
        expect(transformersService).toBeDefined();
    });
    it('should be defined clientsService', () => {
        expect(clientsService).toBeDefined();
    });
    it('should be defined devicesGbService', () => {
        expect(devicesGbService).toBeDefined();
    });
    it('should be defined ucDisabledHistoryService', () => {
        expect(ucDisabledHistoryService).toBeDefined();
    });
    describe('USER Role.SUPERADMIN', () => {
        describe('create', () => {
            let result;
            let dto;
            let currentUser;
            let location;
            let clientId;
            let timeZone;
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)();
                currentUser = (0, currentUser_stub_1.currentUserStub)();
                location = {
                    type: 'Point',
                    coordinates: [dto.longitude, dto.latitude],
                };
                clientId = dto.clientId;
                timeZone = 'Etc/GMT';
                result = await service.create(dto, currentUser);
            });
            it('should return a uc', () => {
                expect(result).toMatchObject((0, uc_stub_1.ucStubs)(dto));
            });
            it('should return a uc with id', () => {
                expect(result._id).toBeDefined();
            });
            it('should call uc repository', () => {
                expect(repository.create).toBeCalledWith({
                    ...dto,
                    location,
                    clientId,
                    timeZone,
                    isCutted: false,
                });
            });
            it('should call uc repository countByDeviceId', () => {
                expect(repository.countByDeviceId).toBeCalledWith(dto.deviceId.toString());
            });
        });
        describe('findAllPaginated', () => {
            let result;
            let dto;
            let currentUser;
            let query;
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)();
                currentUser = (0, currentUser_stub_1.currentUserStub)();
                query = {};
                result = await service.findPaginated(currentUser, query);
            });
            it('should return ucs array', () => {
                expect(result).toMatchObject({ data: [(0, uc_stub_1.ucStubs)(dto)], pageInfo: {} });
            });
        });
        describe('findAll', () => {
            let result;
            let dto;
            let currentUser;
            let query;
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)();
                currentUser = (0, currentUser_stub_1.currentUserStub)();
                query = {
                    clientId: dto.clientId,
                    allows: undefined,
                    deviceType: undefined,
                    transformerId: undefined,
                };
                result = await service.findAll(currentUser, query);
            });
            it('should return ucs array', () => {
                expect(result).toMatchObject([(0, uc_stub_1.ucStubs)(dto)]);
            });
        });
        describe('findByIdPopulate', () => {
            let result;
            let dto;
            let populate;
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)();
                populate = ['deviceId', 'lastReceived', 'settings'];
                result = await service.findByIdPopulate((0, uc_stub_1.ucStubs)(dto)._id.toString(), populate);
            });
            it('should return uc with correct id', () => {
                expect(result._id).toEqual((0, uc_stub_1.ucStubs)(dto)._id);
            });
            it('Should call uc repository (findByIdWithPopulate)', () => {
                expect(repository.findByIdWithPopulate).toBeCalledWith({ _id: (0, uc_stub_1.ucStubs)(dto)._id.toString() }, populate);
            });
        });
        describe('findById', () => {
            let result;
            let dto;
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)();
                result = await service.findById((0, uc_stub_1.ucStubs)(dto)._id.toString());
            });
            it('should return uc with correct id', () => {
                expect(result._id).toEqual((0, uc_stub_1.ucStubs)(dto)._id);
            });
            it('Should call uc repository (findOne)', () => {
                expect(repository.findOne).toBeCalledWith({
                    _id: (0, uc_stub_1.ucStubs)(dto)._id.toString(),
                });
            });
        });
        describe('update', () => {
            let result;
            let dto;
            let currentUser;
            let location;
            let clientId;
            let timeZone;
            const id = '1';
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)({ ucCode: '123' });
                currentUser = (0, currentUser_stub_1.currentUserStub)();
                location = {
                    type: 'Point',
                    coordinates: [dto.longitude, dto.latitude],
                };
                clientId = dto.clientId;
                timeZone = 'Etc/GMT';
                result = await service.update(id, dto, currentUser);
            });
            it('should return uc updated', () => {
                expect(result.ucCode).toEqual(dto.ucCode);
            });
            it('should call uc repository (findOneAndUpdate)', () => {
                expect(repository.findOneAndUpdate).toBeCalledWith({ _id: id }, { ...dto, location, clientId, timeZone });
            });
            it('should call uc repository (countByUcByDeviceId)', () => {
                expect(repository.countByUcByDeviceId).toBeCalledWith(dto.deviceId.toString(), id);
            });
        });
        describe('disable', () => {
            let result;
            const id = '1';
            const deleteData = false;
            let user;
            beforeEach(async () => {
                user = (0, currentUser_stub_1.currentUserStub)();
                result = await service.disable(id, deleteData, user);
            });
            it('Should call uc migrateDevice', () => {
                expect(devicesGbService.migrateDevice).toBeCalledWith({
                    oldDevice: (0, deviceGB_stub_1.deviceGBStub)(),
                    newDevice: (0, deviceGB_stub_1.deviceGBStub)(),
                    deleteOldData: false,
                    uc: {
                        ...(0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)()),
                        deviceId: (0, deviceGB_stub_1.deviceGBStub)(),
                    },
                    hardwareSerial: null,
                    transactionSession: mockSession,
                });
            });
            it('Should call devicesGbService.create', () => {
                const device = {
                    clientId: (0, ucDto_stub_1.ucDtoStubs)().clientId,
                    devId: `ucd-${(0, ucDto_stub_1.ucDtoStubs)().ucCode}`,
                    bucketId: (0, deviceGB_stub_1.deviceGBStub)().bucketId.toString(),
                    name: `UC ${(0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)()).ucCode} desativada`,
                    allows: (0, deviceGB_stub_1.deviceGBStub)().allows,
                    communication: 'PIMA',
                    type: 'LoRa',
                    databaseId: expect.anything(),
                };
                expect(devicesGbService.create).toBeCalledWith(device, mockSession);
            });
            it('Should call ucdisabledHistoryService.create', () => {
                expect(ucDisabledHistoryService.create).toBeCalledWith({
                    dataDeleted: deleteData,
                    devId: (0, deviceGB_stub_1.deviceGBStub)().devId,
                    ucCode: (0, ucDto_stub_1.ucDtoStubs)().ucCode,
                    user: user.username,
                    date: expect.any(Date),
                    clientId: undefined,
                }, mockSession);
            });
        });
    });
});
//# sourceMappingURL=ucs.service.spec.js.map