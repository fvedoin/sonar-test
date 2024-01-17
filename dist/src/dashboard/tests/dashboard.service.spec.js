"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const dashboard_service_1 = require("../dashboard.service");
const ucs_service_1 = require("../../ucs/ucs.service");
const clients_service_1 = require("../../clients/clients.service");
const influx_service_1 = require("../../influx/influx.service");
const dashboard_controller_1 = require("../dashboard.controller");
const last_receiveds_service_1 = require("../../last-receiveds/last-receiveds.service");
const setting_service_1 = require("../../settings/setting.service");
const uc_stub_1 = require("../stubs/uc.stub");
const settings_stub_1 = require("../stubs/settings.stub");
const client_stub_1 = require("../stubs/client.stub");
const influx_stub_1 = require("../stubs/influx.stub");
const lastReceived_stub_1 = require("../stubs/lastReceived.stub");
const influx_buckets_service_1 = require("../../influx-buckets/influx-buckets.service");
const notification_service_1 = require("../../notification/notification.service");
const cut_reconnect_service_1 = require("../../cut-reconnect/cut-reconnect.service");
const notification_stub_1 = require("../stubs/notification.stub");
const device_stub_1 = require("../stubs/device.stub");
const cutReconnect_stub_1 = require("../stubs/cutReconnect.stub");
const energy_service_1 = require("../../energy/energy.service");
const consumed_stub_1 = require("../../energy/stubs/consumed.stub");
describe('DashboardService', () => {
    let dashboardService;
    let ucsService;
    let clientsService;
    let influxService;
    let settingsService;
    let lastReceivedsService;
    let energyService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [dashboard_controller_1.DashboardController],
            providers: [
                dashboard_service_1.DashboardService,
                {
                    provide: ucs_service_1.UcsService,
                    useValue: {
                        findWhere: jest.fn().mockResolvedValue([(0, uc_stub_1.ucStub)()]),
                    },
                },
                {
                    provide: influx_buckets_service_1.InfluxBucketsService,
                    useValue: {
                        findOne: jest.fn().mockResolvedValue((0, client_stub_1.clientStub)()),
                        findOneWhere: jest.fn().mockResolvedValue((0, influx_stub_1.influxBucketStub)()),
                    },
                },
                {
                    provide: notification_service_1.NotificationService,
                    useValue: {
                        findByClientId: jest.fn().mockResolvedValue((0, notification_stub_1.notificationStub)()),
                    },
                },
                {
                    provide: cut_reconnect_service_1.CutReconnectService,
                    useValue: {
                        findWhere: jest.fn().mockResolvedValue((0, cutReconnect_stub_1.cutReconnectStub)()),
                        findByClientId: jest.fn().mockResolvedValue((0, device_stub_1.devicesStub)()),
                    },
                },
                {
                    provide: clients_service_1.ClientsService,
                    useValue: {
                        findOne: jest.fn().mockResolvedValue((0, client_stub_1.clientStub)()),
                    },
                },
                {
                    provide: influx_service_1.InfluxService,
                    useValue: {
                        lastHour: jest.fn().mockResolvedValue([(0, influx_stub_1.influxStub)()]),
                        getConsume: jest.fn().mockResolvedValue([(0, influx_stub_1.influxStub)()]),
                        dashboardQuality: jest.fn().mockResolvedValue([(0, influx_stub_1.qualityStub)()]),
                    },
                },
                {
                    provide: setting_service_1.SettingsService,
                    useValue: {
                        find: jest.fn().mockResolvedValue((0, settings_stub_1.settingsStub)()),
                    },
                },
                {
                    provide: last_receiveds_service_1.LastReceivedsService,
                    useValue: {
                        find: jest.fn().mockResolvedValue([(0, lastReceived_stub_1.lastReceivedStub)()]),
                    },
                },
                {
                    provide: energy_service_1.EnergyService,
                    useValue: {
                        findEnergyTotal: jest.fn().mockResolvedValue([(0, consumed_stub_1.consumedStub)()]),
                    },
                },
            ],
        }).compile();
        dashboardService = module.get(dashboard_service_1.DashboardService);
        dashboardService = module.get(dashboard_service_1.DashboardService);
        ucsService = module.get(ucs_service_1.UcsService);
        clientsService = module.get(clients_service_1.ClientsService);
        influxService = module.get(influx_service_1.InfluxService);
        settingsService = module.get(setting_service_1.SettingsService);
        lastReceivedsService =
            module.get(last_receiveds_service_1.LastReceivedsService);
        energyService = module.get(energy_service_1.EnergyService);
    });
    it('should be defined dashboardService', () => {
        expect(dashboardService).toBeDefined();
    });
    it('should be defined ucsService', () => {
        expect(ucsService).toBeDefined();
    });
    it('should be defined clientsService', () => {
        expect(clientsService).toBeDefined();
    });
    it('should be defined influxService', () => {
        expect(influxService).toBeDefined();
    });
    it('should be defined settingsService', () => {
        expect(settingsService).toBeDefined();
    });
    it('should be defined lastReceivedsService', () => {
        expect(lastReceivedsService).toBeDefined();
    });
    describe('lastHour', () => {
        let result;
        let clientId;
        const host = process.env.INFLUX_HOST;
        const apiToken = process.env.INFLUX_API_TOKEN;
        const devId = 'fxrl-00';
        const bucket = 'fox-iot-telemedicao-b';
        const device = (0, uc_stub_1.ucStub)().deviceId;
        beforeEach(async () => {
            clientId = '123';
            result = await dashboardService.lastHour(clientId);
        });
        it('should call ucsService', () => {
            expect(ucsService.findWhere).toBeCalledWith({
                clientId,
                deviceId: { $exists: true },
            }, { _id: 0, ucCode: 1, deviceId: 1, ratedVoltage: 1 });
        });
        it('should call settingsService', () => {
            expect(settingsService.find).toBeCalledWith({ clientId }, { _id: 0 });
        });
        it('should call influxService', () => {
            expect(influxService.lastHour).toBeCalledWith({
                apiToken,
                bucket,
                devId,
                host,
            });
        });
        it('should call lastReceivedsService', () => {
            expect(lastReceivedsService.find).toBeCalledWith({
                deviceId: device._id,
            }, { _id: 0, receivedAt: 1 });
        });
        it('should return lastHour', () => {
            expect(result.ucs[0].lastHour).toMatchObject({
                min: 0,
                max: 0,
            });
        });
        it('should return status', () => {
            expect(result.ucs[0].status).toEqual('Online');
        });
        it('should return ucCode', () => {
            expect(result.ucs[0].ucCode).toEqual('10108');
        });
    });
});
//# sourceMappingURL=dashboard.service.spec.js.map