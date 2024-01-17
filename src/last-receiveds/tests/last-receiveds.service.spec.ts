import { Test, TestingModule } from '@nestjs/testing';
import { LastReceivedsService } from 'src/last-receiveds/last-receiveds.service';
import { LastReceivedsRepository } from '../last-receiveds.repository';
import { LastReceived } from '../entities/last-received.entity';
import { FilterQuery, ProjectionFields } from 'mongoose';
import { lastReceivedsStubs } from '../stubs/lastReceiveds.stubs';
jest.mock('../last-receiveds.repository');

describe('LastReceivedsService', () => {
  let service: LastReceivedsService;
  let repository: LastReceivedsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [LastReceivedsService, LastReceivedsRepository],
    }).compile();

    service = module.get<LastReceivedsService>(LastReceivedsService);
    repository = module.get<LastReceivedsRepository>(LastReceivedsRepository);
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  describe('find', () => {
    let result: Partial<LastReceived[]>;
    let query: FilterQuery<LastReceived>;
    let projection: ProjectionFields<LastReceived>;

    beforeEach(async () => {
      query = {};
      projection = {
        _id: 0,
        __v: 0,
        package: 0,
        receivedAt: 1,
        deviceId: 1,
        port: 1,
      };
      result = await service.find(query, projection);
    });

    it('should be called repository with query and projection', () => {
      expect(repository.find).toBeCalledWith(query, projection);
    });

    it('should return a last received', () => {
      expect(result).toMatchObject([lastReceivedsStubs()]);
    });
  });
});
