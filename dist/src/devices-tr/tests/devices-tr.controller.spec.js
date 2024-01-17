"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const devices_tr_controller_1 = require("../devices-tr.controller");
const devices_tr_service_1 = require("../devices-tr.service");
const clients_service_1 = require("../../clients/clients.service");
const mqtt_access_service_1 = require("../../mqtt-access/mqtt-access.service");
const user_stub_1 = require("../stubs/user.stub");
const devices_tr_stub_1 = require("../stubs/devices-tr.stub");
const transformers_service_1 = require("../../transformers/transformers.service");
const influx_service_1 = require("../../influx/influx.service");
const influx_connections_service_1 = require("../../influx-connections/influx-connections.service");
const influxBuckets_service_1 = require("../__mocks__/influxBuckets.service");
jest.mock('../devices-tr.service');
jest.mock('src/clients/clients.service');
jest.mock('src/mqtt-access/mqtt-access.service');
jest.mock('src/influx/influx.service');
jest.mock('src/influx-connections/influx-connections.service');
jest.mock('src/transformers/transformers.service');
jest.mock('src/influx-buckets/influx-buckets.service');
const user = (0, user_stub_1.userStub)();
describe('DevicesTrController', () => {
    let controller;
    let service;
    let clientsService;
    let mqttAccessesService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [devices_tr_controller_1.DevicesTrController],
            providers: [
                devices_tr_service_1.DevicesTrService,
                clients_service_1.ClientsService,
                mqtt_access_service_1.MqttAccessService,
                transformers_service_1.TransformersService,
                influx_service_1.InfluxService,
                influx_connections_service_1.InfluxConnectionsService,
                influxBuckets_service_1.InfluxBucketsService,
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
        controller = module.get(devices_tr_controller_1.DevicesTrController);
        service = module.get(devices_tr_service_1.DevicesTrService);
        clientsService = module.get(clients_service_1.ClientsService);
        mqttAccessesService = module.get(mqtt_access_service_1.MqttAccessService);
        jest.clearAllMocks();
    });
    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    it('should be defined clients', () => {
        expect(clientsService).toBeDefined();
    });
    it('should be defined mqttAccess', () => {
        expect(mqttAccessesService).toBeDefined();
    });
    describe('findFilteredDevicesTr', () => {
        let result;
        beforeEach(async () => {
            result = await service.findFilteredDevicesTr(user);
        });
        it('should return devices-tr array', () => {
            expect(result).toEqual([(0, devices_tr_stub_1.deviceTrStub)()]);
        });
        it('Should call devices-tr service', () => {
            expect(service.findFilteredDevicesTr).toBeCalled();
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
        it('Should call devices-tr service', () => {
            expect(service.findFilteredTransformerDevices).toBeCalled();
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
        it('Should call devices-tr service', () => {
            expect(service.findFilteredTransformerTelikTrafoLite).toBeCalled();
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
        it('Should call devices-tr service', () => {
            expect(service.findTelikTrafoLiteDevices).toBeCalled();
        });
    });
});
//# sourceMappingURL=devices-tr.controller.spec.js.map