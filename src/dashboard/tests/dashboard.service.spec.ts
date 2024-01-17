import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService, LastHourResult } from '../dashboard.service';
import { UcsService } from 'src/ucs/ucs.service';
import { ClientsService } from 'src/clients/clients.service';
import { InfluxService } from 'src/influx/influx.service';
import { DashboardController } from '../dashboard.controller';
import { LastReceivedsService } from 'src/last-receiveds/last-receiveds.service';
import { SettingsService } from 'src/settings/setting.service';
import { ucStub } from '../stubs/uc.stub';
import { settingsStub } from '../stubs/settings.stub';
import { clientStub } from '../stubs/client.stub';
import {
  influxBucketStub,
  influxStub,
  qualityStub,
} from '../stubs/influx.stub';
import { lastReceivedStub } from '../stubs/lastReceived.stub';
import { DeviceGb } from 'src/devices-gb/entities/devices-gb.entity';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { NotificationService } from 'src/notification/notification.service';
import { CutReconnectService } from 'src/cut-reconnect/cut-reconnect.service';
import { notificationStub } from '../stubs/notification.stub';
import { devicesStub } from '../stubs/device.stub';
import { cutReconnectStub } from '../stubs/cutReconnect.stub';
import { EnergyService } from 'src/energy/energy.service';
import { consumedStub } from 'src/energy/stubs/consumed.stub';

//TODO: Mockar services em pasta separada __mocks__
describe('DashboardService', () => {
  let dashboardService: DashboardService;
  let ucsService: UcsService;
  let clientsService: ClientsService;
  let influxService: InfluxService;
  let settingsService: SettingsService;
  let lastReceivedsService: LastReceivedsService;
  let energyService: EnergyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        DashboardService,
        {
          provide: UcsService,
          useValue: {
            findWhere: jest.fn().mockResolvedValue([ucStub()]),
          },
        },
        {
          provide: InfluxBucketsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(clientStub()),
            findOneWhere: jest.fn().mockResolvedValue(influxBucketStub()),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            findByClientId: jest.fn().mockResolvedValue(notificationStub()),
          },
        },
        {
          provide: CutReconnectService,
          useValue: {
            findWhere: jest.fn().mockResolvedValue(cutReconnectStub()),
            findByClientId: jest.fn().mockResolvedValue(devicesStub()),
          },
        },
        {
          provide: ClientsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(clientStub()),
          },
        },
        {
          provide: InfluxService,
          useValue: {
            lastHour: jest.fn().mockResolvedValue([influxStub()]),
            getConsume: jest.fn().mockResolvedValue([influxStub()]),
            dashboardQuality: jest.fn().mockResolvedValue([qualityStub()]),
          },
        },
        {
          provide: SettingsService,
          useValue: {
            find: jest.fn().mockResolvedValue(settingsStub()),
          },
        },
        {
          provide: LastReceivedsService,
          useValue: {
            find: jest.fn().mockResolvedValue([lastReceivedStub()]),
          },
        },
        {
          provide: EnergyService,
          useValue: {
            findEnergyTotal: jest.fn().mockResolvedValue([consumedStub()]),
          },
        },
      ],
    }).compile();

    dashboardService = module.get<DashboardService>(DashboardService);
    dashboardService = module.get<DashboardService>(DashboardService);
    ucsService = module.get<UcsService>(UcsService);
    clientsService = module.get<ClientsService>(ClientsService);
    influxService = module.get<InfluxService>(InfluxService);
    settingsService = module.get<SettingsService>(SettingsService);
    lastReceivedsService =
      module.get<LastReceivedsService>(LastReceivedsService);
    energyService = module.get<EnergyService>(EnergyService);
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
    let result: LastHourResult;
    let clientId: string;
    const host = process.env.INFLUX_HOST;
    const apiToken = process.env.INFLUX_API_TOKEN;
    const devId = 'fxrl-00';
    const bucket = 'fox-iot-telemedicao-b';
    const device = ucStub().deviceId as DeviceGb;

    beforeEach(async () => {
      clientId = '123';
      result = await dashboardService.lastHour(clientId);
    });

    it('should call ucsService', () => {
      expect(ucsService.findWhere).toBeCalledWith(
        {
          clientId,
          deviceId: { $exists: true },
        },
        { _id: 0, ucCode: 1, deviceId: 1, ratedVoltage: 1 },
      );
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
      expect(lastReceivedsService.find).toBeCalledWith(
        {
          deviceId: device._id,
        },
        { _id: 0, receivedAt: 1 },
      );
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
