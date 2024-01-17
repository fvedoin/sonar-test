import { Test, TestingModule } from '@nestjs/testing';
import { DevicesTrRepository } from '../devices-tr.repository';
import { DevicesTrService } from '../devices-tr.service';
import { DevicesTrController } from '../devices-tr.controller';
import { ClientsService } from 'src/clients/clients.service';
import { MqttAccessService } from 'src/mqtt-access/mqtt-access.service';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { DeviceTr } from '../entities/devices-tr.entity';
import { userStub } from '../stubs/user.stub';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { deviceTrStub } from '../stubs/devices-tr.stub';
import { InfluxService } from 'src/influx/influx.service';
import { InfluxConnectionsService } from 'src/influx-connections/influx-connections.service';
import { TransformersService } from 'src/transformers/transformers.service';
import { transformersDtoStubs } from '../stubs/transformerDTO.stub';
import mongoose from 'mongoose';
import {
  apparentPowerPhaseResultStubs,
  findApparentPowerPhaseStubs,
} from '../stubs/findApparentPowerPhaseStubs.stub';

jest.mock('../devices-tr.repository');
jest.mock('src/clients/clients.service');
jest.mock('src/mqtt-access/mqtt-access.service');
jest.mock('src/influx/influx.service');
jest.mock('src/influx-connections/influx-connections.service');
jest.mock('src/transformers/transformers.service');
jest.mock('src/influx-buckets/influx-buckets.service');

const user: UserFromJwt = userStub();

describe('DevicesTrService', () => {
  let service: DevicesTrService;
  let repository: DevicesTrRepository;
  let clientsService: ClientsService;
  let influxBucketsService: InfluxBucketsService;
  let mqttAccessesService: MqttAccessService;
  let transformersService: TransformersService;
  let influxConnectionService: InfluxConnectionsService;
  let influxService: InfluxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesTrController],
      providers: [
        DevicesTrService,
        DevicesTrRepository,
        ClientsService,
        MqttAccessService,
        InfluxBucketsService,
        {
          provide: TransformersService,
          useValue: {
            findWhereAndPopulate: jest.fn(),
          },
        },
        InfluxService,
        InfluxConnectionsService,
      ],
    }).compile();

    service = module.get<DevicesTrService>(DevicesTrService);
    repository = module.get<DevicesTrRepository>(DevicesTrRepository);
    clientsService = module.get<ClientsService>(ClientsService);
    influxBucketsService =
      module.get<InfluxBucketsService>(InfluxBucketsService);
    mqttAccessesService = module.get<MqttAccessService>(MqttAccessService);
    transformersService = module.get<TransformersService>(TransformersService);
    influxConnectionService = module.get<InfluxConnectionsService>(
      InfluxConnectionsService,
    );
    influxService = module.get<InfluxService>(InfluxService);
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
    let result: DeviceTr[];

    beforeEach(async () => {
      result = await service.findFilteredDevicesTr(user);
    });

    it('should return devices-tr array', () => {
      expect(result).toEqual([deviceTrStub()]);
    });

    it('Should call devices-tr repository', () => {
      expect(repository.aggregate).toBeCalled();
    });
  });

  describe('findFilteredTransformerDevices', () => {
    let result: DeviceTr[];

    beforeEach(async () => {
      result = await service.findFilteredTransformerDevices(
        user,
        user.clientId,
      );
    });

    it('should return devices-tr array', () => {
      expect(result).toEqual([deviceTrStub()]);
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
          ...transformersDtoStubs(''),
          smartTrafoDeviceId: { bucketId: new mongoose.Types.ObjectId() },
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
        .mockResolvedValue(findApparentPowerPhaseStubs());

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

      expect(result).toEqual(apparentPowerPhaseResultStubs);
    });
  });

  describe('findFilteredTransformerTelikTrafoLite', () => {
    let result: DeviceTr[];

    beforeEach(async () => {
      result = await service.findFilteredTransformerTelikTrafoLite(
        user,
        user.clientId,
      );
    });

    it('should return devices-tr array', () => {
      expect(result).toEqual([deviceTrStub()]);
    });

    it('Should call devices-tr repository', () => {
      expect(repository.aggregate).toBeCalled();
    });
  });

  describe('findTelikTrafoLiteDevices', () => {
    let result: DeviceTr[];

    beforeEach(async () => {
      result = await service.findTelikTrafoLiteDevices(user);
    });

    it('should return devices-tr array', () => {
      expect(result).toEqual([deviceTrStub()]);
    });

    it('Should call devices-tr repository', () => {
      expect(repository.aggregate).toBeCalled();
    });
  });
});
