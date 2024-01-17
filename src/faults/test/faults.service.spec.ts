import { Test, TestingModule } from '@nestjs/testing';
import { FaultsService } from '../faults.service';
import { InfluxBucketRepository } from 'src/influx-buckets/influx-buckets.repository';
import { InfluxConnectionRepository } from 'src/influx-connections/influx-connections.repository';
import { InfluxService } from 'src/influx/influx.service';
import { UcsRepository } from 'src/ucs/ucs.repository';

describe('FaultsService', () => {
  let service: FaultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FaultsService,
        { provide: InfluxBucketRepository, useValue: {} },
        { provide: InfluxConnectionRepository, useValue: {} },
        { provide: InfluxService, useValue: {} },
        { provide: UcsRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<FaultsService>(FaultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
