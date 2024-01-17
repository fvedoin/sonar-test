import { Test, TestingModule } from '@nestjs/testing';
import { InfluxService } from '../influx.service';
import { InfluxRepository } from '../influx.repository';
import { LastHourInflux } from 'src/dashboard/interfaces';
import { LastHourDto } from '../dto/lastHour.dto';
import { lastHourDtoStubs } from '../stubs/lastHourDto.stub';
import { lastHourStubs } from '../stubs/lastHours.stub';
import { findQualityDtoStubs } from '../stubs/findQualityDto.stub';
import { findFaultsDtoStubs } from '../stubs/findFaultsDto.stub';
import DataInfluxFindFaults from '../interfaces/dataInfluxFindFaults';
jest.mock('../influx.repository');

describe('InfluxService', () => {
  let service: InfluxService;
  let repository: InfluxRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfluxService, InfluxRepository],
    }).compile();

    service = module.get<InfluxService>(InfluxService);
    repository = module.get<InfluxRepository>(InfluxRepository);
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  describe('lastHour', () => {
    let result: LastHourInflux[];
    let dto: LastHourDto;

    beforeEach(async () => {
      dto = lastHourDtoStubs();
      result = await service.lastHour(dto);
    });

    it('should return a lastHour', () => {
      expect(result).toMatchObject([lastHourStubs()]);
    });

    it('should call influx repository', () => {
      expect(repository.connection).toBeCalledWith(dto.host, dto.apiToken);
    });
  });

  describe('findQuality', () => {
    const url = process.env.INFLUX_HOST;
    const token = process.env.INFLUX_API_TOKEN;

    beforeEach(async () => {
      await service.findQuality(findQualityDtoStubs());
    });

    it('should call influx repository', () => {
      expect(repository.connection).toBeCalledWith(url, token);
    });
  });

  describe('findFaultsFieldsByUcAndPeriod', () => {
    let result: DataInfluxFindFaults[];

    const faultsDtoStub = findFaultsDtoStubs();
    beforeEach(async () => {
      result = await service.findFaultsFieldsByUcAndPeriod(faultsDtoStub);
    });

    it('should call influx repository', () => {
      expect(repository.connection).toBeCalledWith(
        faultsDtoStub.host,
        faultsDtoStub.apiToken,
      );
    });
  });

  describe('findFields', () => {
    const url = process.env.INFLUX_HOST;
    const token = process.env.INFLUX_API_TOKEN;

    beforeEach(async () => {
      await service.findQuality(findQualityDtoStubs());
    });

    it('should call influx repository', () => {
      expect(repository.connection).toBeCalledWith(url, token);
    });
  });
});
