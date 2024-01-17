import { Test, TestingModule } from '@nestjs/testing';
import { EnergyController } from '../energy.controller';
import { EnergyService } from '../energy.service';
import { UcsService } from 'src/ucs/ucs.service';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { InfluxConnectionsService } from 'src/influx-connections/influx-connections.service';
import { MeterChangeService } from 'src/meter-change/meter-change.service';
import { MeterChangeRepository } from 'src/meter-change/meter-change.repository';
import { consumedStub } from '../stubs/consumed.stub';

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
  let controller: EnergyController;
  let service: EnergyService;
  let ucsService: UcsService;
  let influxBucketsService: InfluxBucketsService;
  let influxConnectionsService: InfluxConnectionsService;
  let meterChangeService: MeterChangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnergyController],
      providers: [
        EnergyService,
        InfluxBucketsService,
        InfluxConnectionsService,
        UcsService,
        InfluxConnectionsService,
        MeterChangeService,
        {
          provide: MeterChangeRepository,
          useValue: {
            findByUcCodesPopulate: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<EnergyController>(EnergyController);
    service = module.get<EnergyService>(EnergyService);
    ucsService = module.get<UcsService>(UcsService);
    influxConnectionsService = module.get<InfluxConnectionsService>(
      InfluxConnectionsService,
    );
    influxBucketsService =
      module.get<InfluxBucketsService>(InfluxBucketsService);
    meterChangeService = module.get<MeterChangeService>(MeterChangeService);

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
      const { mockUc, mockField, mockDateRange, mockResponse } = consumedStub();

      jest.spyOn(service, 'findEnergyTotal').mockResolvedValue([mockResponse]);

      const result = await controller.findEnergyTotal(
        mockUc,
        mockField,
        mockDateRange,
      );

      expect(result).toEqual(mockResponse);
    });
  });
  describe('findEnergyPredict', () => {
    it('should call the service method with the correct parameters', async () => {
      const { mockUc, mockField, mockDateRange, mockResponse } = consumedStub();

      jest
        .spyOn(service, 'findEnergyPredictionTotal')
        .mockResolvedValue([mockResponse]);

      const result = await controller.findEnergyPredictionTotal(
        mockUc,
        mockField,
        mockDateRange,
      );

      expect(result).toEqual(mockResponse);
    });
  });
});
