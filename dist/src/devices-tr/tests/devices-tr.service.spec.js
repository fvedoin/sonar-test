"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const devices_tr_repository_1 = require("../devices-tr.repository");
const devices_tr_service_1 = require("../devices-tr.service");
const devices_tr_controller_1 = require("../devices-tr.controller");
const clients_service_1 = require("../../clients/clients.service");
const mqtt_access_service_1 = require("../../mqtt-access/mqtt-access.service");
const influx_buckets_service_1 = require("../../influx-buckets/influx-buckets.service");
const user_stub_1 = require("../stubs/user.stub");
const devices_tr_stub_1 = require("../stubs/devices-tr.stub");
const influx_service_1 = require("../../influx/influx.service");
const influx_connections_service_1 = require("../../influx-connections/influx-connections.service");
const transformers_service_1 = require("../../transformers/transformers.service");
const transformerDTO_stub_1 = require("../stubs/transformerDTO.stub");
const mongoose_1 = require("mongoose");
const findApparentPowerPhaseStubs_stub_1 = require("../stubs/findApparentPowerPhaseStubs.stub");
jest.mock('../devices-tr.repository');
jest.mock('src/clients/clients.service');
jest.mock('src/mqtt-access/mqtt-access.service');
jest.mock('src/influx/influx.service');
jest.mock('src/influx-connections/influx-connections.service');
jest.mock('src/transformers/transformers.service');
jest.mock('src/influx-buckets/influx-buckets.service');
const user = (0, user_stub_1.userStub)();
describe('DevicesTrService', () => {
    let service;
    let repository;
    let clientsService;
    let influxBucketsService;
    let mqttAccessesService;
    let transformersService;
    let influxConnectionService;
    let influxService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [devices_tr_controller_1.DevicesTrController],
            providers: [
                devices_tr_service_1.DevicesTrService,
                devices_tr_repository_1.DevicesTrRepository,
                clients_service_1.ClientsService,
                mqtt_access_service_1.MqttAccessService,
                influx_buckets_service_1.InfluxBucketsService,
                {
                    provide: transformers_service_1.TransformersService,
                    useValue: {
                        findWhereAndPopulate: jest.fn(),
                    },
                },
                influx_service_1.InfluxService,
                influx_connections_service_1.InfluxConnectionsService,
            ],
        }).compile();
        service = module.get(devices_tr_service_1.DevicesTrService);
        repository = module.get(devices_tr_repository_1.DevicesTrRepository);
        clientsService = module.get(clients_service_1.ClientsService);
        influxBucketsService =
            module.get(influx_buckets_service_1.InfluxBucketsService);
        mqttAccessesService = module.get(mqtt_access_service_1.MqttAccessService);
        transformersService = module.get(transformers_service_1.TransformersService);
        influxConnectionService = module.get(influx_connections_service_1.InfluxConnectionsService);
        influxService = module.get(influx_service_1.InfluxService);
        jest.clearAllMocks();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    it('should be defined clients', () => {
        expect(clientsService).toBeDefined();
    });
    it('should be defined mqttAccess', () => {
        expect(mqttAccessesService).toBeDefined();
    });
    it('should be defined influxBuckets', () => {
        expect(influxBucketsService).toBeDefined();
    });
    describe('findFilteredDevicesTr', () => {
        let result;
        beforeEach(async () => {
            result = await service.findFilteredDevicesTr(user);
        });
        it('should return devices-tr array', () => {
            expect(result).toEqual([(0, devices_tr_stub_1.deviceTrStub)()]);
        });
        it('Should call devices-tr repository', () => {
            expect(repository.aggregate).toBeCalled();
        });
    });
    describe('findFilteredTransformerDevices', () => {
        let result;
        beforeEach(async () => {
            result = await service.findFilteredTransformerDevices(user, user.clientId);
        });
        it('should return devices-tr array', () => {
            expect(result).toEqual([(0, devices_tr_stub_1.deviceTrStub)()]);
        });
        it('Should call devices-tr repository', () => {
            expect(repository.aggregate).toBeCalled();
        });
    });
    describe('analytics', () => {
        it('should return devices-tr array', async () => {
            transformersService.findWhereAndPopulate = jest
                .fn()
                .mockResolvedValue([]);
            const result = await service.getAnalytics({
                trsIds: ['64de197e761161006887413c'],
                dateRange: {
                    startDate: '2023-10-17T03:00:00.000Z',
                    endDate: '2023-10-26T02:59:59.000Z',
                },
                fields: [
                    'apparent_power_phase_a',
                    'apparent_power_phase_b',
                    'apparent_power_phase_c',
                ],
            });
            expect(result).toEqual([
                [
                    'Data',
                    'Hora',
                    'Tempo',
                    'IT',
                    'apparent_power_phase_a',
                    'apparent_power_phase_b',
                    'apparent_power_phase_c',
                ],
            ]);
        });
        it('should return devices-tr array', async () => {
            transformersService.findWhereAndPopulate = jest.fn().mockResolvedValue([
                {
                    ...(0, transformerDTO_stub_1.transformersDtoStubs)(''),
                    smartTrafoDeviceId: { bucketId: new mongoose_1.default.Types.ObjectId() },
                },
            ]);
            influxBucketsService.findOne = jest.fn().mockResolvedValue({
                influxConnectionId: 'teste@test.com',
            });
            influxConnectionService.findOne = jest.fn().mockResolvedValue({
                host: 'teste@test.com',
                apiToken: '123456',
            });
            influxService.findAnalyticsFieldData = jest
                .fn()
                .mockResolvedValue((0, findApparentPowerPhaseStubs_stub_1.findApparentPowerPhaseStubs)());
            const result = await service.getAnalytics({
                trsIds: ['64de197e761161006887413c'],
                dateRange: {
                    startDate: '2023-10-17T03:00:00.000Z',
                    endDate: '2023-10-26T02:59:59.000Z',
                },
                fields: [
                    'apparent_power_phase_a',
                    'apparent_power_phase_b',
                    'apparent_power_phase_c',
                ],
            });
            expect(result).toEqual(findApparentPowerPhaseStubs_stub_1.apparentPowerPhaseResultStubs);
        });
    });
    describe('findFilteredTransformerTelikTrafoLite', () => {
        let result;
        beforeEach(async () => {
            result = await service.findFilteredTransformerTelikTrafoLite(user, user.clientId);
        });
        it('should return devices-tr array', () => {
            expect(result).toEqual([(0, devices_tr_stub_1.deviceTrStub)()]);
        });
        it('Should call devices-tr repository', () => {
            expect(repository.aggregate).toBeCalled();
        });
    });
    describe('findTelikTrafoLiteDevices', () => {
        let result;
        beforeEach(async () => {
            result = await service.findTelikTrafoLiteDevices(user);
        });
        it('should return devices-tr array', () => {
            expect(result).toEqual([(0, devices_tr_stub_1.deviceTrStub)()]);
        });
        it('Should call devices-tr repository', () => {
            expect(repository.aggregate).toBeCalled();
        });
    });
});
//# sourceMappingURL=devices-tr.service.spec.js.map