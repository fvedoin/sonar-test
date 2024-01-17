"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const devices_gb_controller_1 = require("../devices-gb.controller");
const devices_gb_service_1 = require("../devices-gb.service");
const devices_gb_repository_1 = require("../devices-gb.repository");
const influx_service_1 = require("../../influx/influx.service");
const influx_connections_service_1 = require("../../influx-connections/influx-connections.service");
const notification_service_1 = require("../../notification/notification.service");
const influx_buckets_service_1 = require("../../influx-buckets/influx-buckets.service");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const applications_service_1 = require("../../applications/applications.service");
const mqtt_access_service_1 = require("../../mqtt-access/mqtt-access.service");
const deviceGB_stub_1 = require("../stubs/deviceGB.stub");
const ttn_service_1 = require("../../common/services/ttn.service");
const influxConnection_stub_1 = require("../stubs/influxConnection.stub");
const mongoose_2 = require("mongoose");
const stream_1 = require("stream");
const bucket_stub_1 = require("../stubs/bucket.stub");
jest.mock('../devices-gb.repository');
jest.mock('src/influx/influx.service');
jest.mock('src/influx-connections/influx-connections.service');
jest.mock('src/notification/notification.service');
jest.mock('src/influx-buckets/influx-buckets.service');
const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
};
const stream = new stream_1.Readable();
stream._read = function (size) {
};
describe('UcsService', () => {
    let service;
    let influxService;
    let repository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [devices_gb_controller_1.DevicesGbController],
            providers: [
                devices_gb_service_1.DevicesGbService,
                devices_gb_repository_1.DevicesGbRepository,
                {
                    provide: influx_service_1.InfluxService,
                    useValue: {
                        getAllDataByDevId: jest.fn().mockResolvedValue({
                            data: stream,
                        }),
                        deleteOldDataByDevId: jest.fn().mockResolvedValue(null),
                    },
                },
                {
                    provide: influx_connections_service_1.InfluxConnectionsService,
                    useValue: {
                        findOne: jest
                            .fn()
                            .mockResolvedValue((0, influxConnection_stub_1.influxConnectionStub)(new mongoose_2.Types.ObjectId('6401fdaf1224add8ade50026'), {})),
                    },
                },
                notification_service_1.NotificationService,
                influx_buckets_service_1.InfluxBucketsService,
                {
                    provide: applications_service_1.ApplicationsService,
                    useValue: {},
                },
                {
                    provide: mqtt_access_service_1.MqttAccessService,
                    useValue: {},
                },
                {
                    provide: common_1.CACHE_MANAGER,
                    useFactory: jest.fn(),
                    useValue: { del: jest.fn(), set: jest.fn() },
                },
                {
                    provide: (0, mongoose_1.getConnectionToken)('Database'),
                    useValue: {
                        startSession: jest.fn().mockReturnValue(mockSession),
                    },
                },
            ],
        }).compile();
        influxService = module.get(influx_service_1.InfluxService);
        service = module.get(devices_gb_service_1.DevicesGbService);
        repository = module.get(devices_gb_repository_1.DevicesGbRepository);
        jest.clearAllMocks();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    describe('migrate', () => {
        let result;
        const id = '1';
        const newDeviceId = '2';
        const deleteData = true;
        const dev_eui = '1';
        let migrateDeviceSpy;
        let deleteOldDataByDevId;
        const influxConnectionMock = (0, influxConnection_stub_1.influxConnectionStub)(new mongoose_2.Types.ObjectId(), {});
        const deviceMock = (0, deviceGB_stub_1.deviceGBStub)();
        beforeEach(async () => {
            migrateDeviceSpy = jest.spyOn(service, 'migrateDevice');
            deleteOldDataByDevId = jest.spyOn(influxService, 'deleteOldDataByDevId');
            const TtnServiceSpy = jest.spyOn(ttn_service_1.TtnService, 'get');
            TtnServiceSpy.mockResolvedValue({
                data: {
                    ids: { dev_eui },
                },
            });
            setTimeout(() => stream.emit('end'), 1000);
            result = await service.migrate(id, newDeviceId, deleteData);
        });
        it('Should call uc migrateDevice', () => {
            expect(migrateDeviceSpy).toBeCalledWith({
                oldDevice: deviceMock,
                newDevice: deviceMock,
                deleteOldData: deleteData,
                hardwareSerial: dev_eui,
                transactionSession: mockSession,
            });
        });
        it('Should call deleteOldDataByDevId', () => {
            expect(deleteOldDataByDevId).toBeCalledWith({
                apiToken: influxConnectionMock.apiToken,
                bucketName: (0, bucket_stub_1.bucketStub)().name,
                devId: deviceMock.devId,
                host: influxConnectionMock.host,
                orgId: influxConnectionMock.orgId,
            });
        });
    });
});
//# sourceMappingURL=devices-gb.service.spec.js.map