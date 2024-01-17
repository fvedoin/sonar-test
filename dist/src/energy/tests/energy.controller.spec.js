"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const energy_controller_1 = require("../energy.controller");
const energy_service_1 = require("../energy.service");
const ucs_service_1 = require("../../ucs/ucs.service");
const influx_buckets_service_1 = require("../../influx-buckets/influx-buckets.service");
const influx_connections_service_1 = require("../../influx-connections/influx-connections.service");
const meter_change_service_1 = require("../../meter-change/meter-change.service");
const meter_change_repository_1 = require("../../meter-change/meter-change.repository");
const consumed_stub_1 = require("../stubs/consumed.stub");
jest.mock('src/influx-connections/influx-connections.service', () => ({
    InfluxConnectionsService: jest.fn().mockImplementation(() => ({
        findOne: jest.fn().mockResolvedValue({
            host: 'example.com',
            apiToken: 'token1',
        }),
    })),
}));
jest.mock('src/influx-buckets/influx-buckets.service', () => ({
    InfluxBucketsService: jest.fn().mockImplementation(() => ({
        findOne: jest.fn().mockResolvedValue({
            influxConnectionId: 'connection1',
            name: 'bucket1',
        }),
    })),
}));
jest.mock('src/meter-change/meter-change.service', () => ({
    MeterChangeService: jest.fn().mockReturnValue({
        find: jest.fn().mockResolvedValue([]),
    }),
}));
jest.mock('src/ucs/ucs.service', () => ({
    UcsService: jest.fn().mockImplementation(() => ({
        findByUcCodesPopulate: jest
            .fn()
            .mockResolvedValue([
            { deviceId: { devId: 'dev1', bucketId: 'bucket1' } },
        ]),
    })),
}));
describe('EnergyController', () => {
    let controller;
    let service;
    let ucsService;
    let influxBucketsService;
    let influxConnectionsService;
    let meterChangeService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [energy_controller_1.EnergyController],
            providers: [
                energy_service_1.EnergyService,
                influx_buckets_service_1.InfluxBucketsService,
                influx_connections_service_1.InfluxConnectionsService,
                ucs_service_1.UcsService,
                influx_connections_service_1.InfluxConnectionsService,
                meter_change_service_1.MeterChangeService,
                {
                    provide: meter_change_repository_1.MeterChangeRepository,
                    useValue: {
                        findByUcCodesPopulate: jest.fn().mockResolvedValue({}),
                    },
                },
            ],
        }).compile();
        controller = module.get(energy_controller_1.EnergyController);
        service = module.get(energy_service_1.EnergyService);
        ucsService = module.get(ucs_service_1.UcsService);
        influxConnectionsService = module.get(influx_connections_service_1.InfluxConnectionsService);
        influxBucketsService =
            module.get(influx_buckets_service_1.InfluxBucketsService);
        meterChangeService = module.get(meter_change_service_1.MeterChangeService);
        jest.clearAllMocks();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });
    it('should be defined ucsService', () => {
        expect(ucsService).toBeDefined();
    });
    it('should be defined influxBucketsService', () => {
        expect(influxBucketsService).toBeDefined();
    });
    it('should be defined influxConnectionsService', () => {
        expect(influxConnectionsService).toBeDefined();
    });
    it('should be defined meterChangeService', () => {
        expect(meterChangeService).toBeDefined();
    });
    describe('findEnergyTotal', () => {
        it('should call the service method with the correct parameters', async () => {
            const { mockUc, mockField, mockDateRange, mockResponse } = (0, consumed_stub_1.consumedStub)();
            jest.spyOn(service, 'findEnergyTotal').mockResolvedValue([mockResponse]);
            const result = await controller.findEnergyTotal(mockUc, mockField, mockDateRange);
            expect(result).toEqual(mockResponse);
        });
    });
    describe('findEnergyPredict', () => {
        it('should call the service method with the correct parameters', async () => {
            const { mockUc, mockField, mockDateRange, mockResponse } = (0, consumed_stub_1.consumedStub)();
            jest
                .spyOn(service, 'findEnergyPredictionTotal')
                .mockResolvedValue([mockResponse]);
            const result = await controller.findEnergyPredictionTotal(mockUc, mockField, mockDateRange);
            expect(result).toEqual(mockResponse);
        });
    });
});
//# sourceMappingURL=energy.controller.spec.js.map