import { Test, TestingModule } from '@nestjs/testing';
import { DevicesTrController } from '../devices-tr.controller';
import { DevicesTrService } from '../devices-tr.service';
import { ClientsService } from 'src/clients/clients.service';
import { MqttAccessService } from 'src/mqtt-access/mqtt-access.service';
import { DeviceTr } from '../entities/devices-tr.entity';
import { userStub } from '../stubs/user.stub';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { deviceTrStub } from '../stubs/devices-tr.stub';
import { TransformersService } from 'src/transformers/transformers.service';
import { InfluxService } from 'src/influx/influx.service';
import { InfluxConnectionsService } from 'src/influx-connections/influx-connections.service';
import { InfluxBucketsService } from '../__mocks__/influxBuckets.service';

jest.mock('../devices-tr.service');
jest.mock('src/clients/clients.service');
jest.mock('src/mqtt-access/mqtt-access.service');
jest.mock('src/influx/influx.service');
jest.mock('src/influx-connections/influx-connections.service');
jest.mock('src/transformers/transformers.service');
jest.mock('src/influx-buckets/influx-buckets.service');

const user: UserFromJwt = userStub();

describe('DevicesTrController', () => {
  let controller: DevicesTrController;
  let service: DevicesTrService;
  let clientsService: ClientsService;
  let mqttAccessesService: MqttAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesTrController],
      providers: [
        DevicesTrService,
        ClientsService,
        MqttAccessService,
        TransformersService,
        InfluxService,
        InfluxConnectionsService,
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

    controller = module.get<DevicesTrController>(DevicesTrController);
    service = module.get<DevicesTrService>(DevicesTrService);
    clientsService = module.get<ClientsService>(ClientsService);
    mqttAccessesService = module.get<MqttAccessService>(MqttAccessService);
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
    let result: DeviceTr[];

    beforeEach(async () => {
      result = await service.findFilteredDevicesTr(user);
    });

    it('should return devices-tr array', () => {
      expect(result).toEqual([deviceTrStub()]);
    });

    it('Should call devices-tr service', () => {
      expect(service.findFilteredDevicesTr).toBeCalled();
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

    it('Should call devices-tr service', () => {
      expect(service.findFilteredTransformerDevices).toBeCalled();
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

    it('Should call devices-tr service', () => {
      expect(service.findFilteredTransformerTelikTrafoLite).toBeCalled();
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

    it('Should call devices-tr service', () => {
      expect(service.findTelikTrafoLiteDevices).toBeCalled();
    });
  });
});
