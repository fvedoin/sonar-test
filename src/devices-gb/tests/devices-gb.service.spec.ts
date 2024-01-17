import { Test, TestingModule } from '@nestjs/testing';
import { DevicesGbController } from '../devices-gb.controller';
import { DevicesGbService } from '../devices-gb.service';
import { DevicesGbRepository } from '../devices-gb.repository';
import { InfluxService } from 'src/influx/influx.service';
import { InfluxConnectionsService } from 'src/influx-connections/influx-connections.service';
import { NotificationService } from 'src/notification/notification.service';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { CACHE_MANAGER } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { ApplicationsService } from 'src/applications/applications.service';
import { MqttAccessService } from 'src/mqtt-access/mqtt-access.service';
import { deviceGBStub } from '../stubs/deviceGB.stub';
import { TtnService } from 'src/common/services/ttn.service';
import { influxConnectionStub } from '../stubs/influxConnection.stub';
import { Types } from 'mongoose';
import { Readable } from 'stream';
import { bucketStub } from '../stubs/bucket.stub';

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

const stream = new Readable();
stream._read = function (size) {
  /* do nothing */
};

describe('UcsService', () => {
  let service: DevicesGbService;
  let influxService: InfluxService;
  let repository: DevicesGbRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesGbController],
      providers: [
        DevicesGbService,
        DevicesGbRepository,
        {
          provide: InfluxService,
          useValue: {
            getAllDataByDevId: jest.fn().mockResolvedValue({
              data: stream,
            }),
            deleteOldDataByDevId: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: InfluxConnectionsService,
          useValue: {
            findOne: jest
              .fn()
              .mockResolvedValue(
                influxConnectionStub(
                  new Types.ObjectId('6401fdaf1224add8ade50026'),
                  {},
                ),
              ),
          },
        },
        NotificationService,
        InfluxBucketsService,
        {
          provide: ApplicationsService,
          useValue: {},
        },
        {
          provide: MqttAccessService,
          useValue: {},
        },
        {
          provide: CACHE_MANAGER,
          useFactory: jest.fn(),
          useValue: { del: jest.fn(), set: jest.fn() },
        },
        {
          provide: getConnectionToken('Database'),
          useValue: {
            startSession: jest.fn().mockReturnValue(mockSession),
          },
        },
      ],
    }).compile();

    influxService = module.get<InfluxService>(InfluxService);
    service = module.get<DevicesGbService>(DevicesGbService);
    repository = module.get<DevicesGbRepository>(DevicesGbRepository);

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
    const influxConnectionMock = influxConnectionStub(new Types.ObjectId(), {});
    const deviceMock = deviceGBStub();

    beforeEach(async () => {
      migrateDeviceSpy = jest.spyOn(service, 'migrateDevice');
      deleteOldDataByDevId = jest.spyOn(influxService, 'deleteOldDataByDevId');

      const TtnServiceSpy = jest.spyOn(TtnService, 'get');

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
        bucketName: bucketStub().name,
        devId: deviceMock.devId,
        host: influxConnectionMock.host,
        orgId: influxConnectionMock.orgId,
      });
    });
  });
});
