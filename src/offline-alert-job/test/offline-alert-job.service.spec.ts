import { Test, TestingModule } from '@nestjs/testing';
import { OfflineAlertJobService } from '../offline-alert-job.service';

describe('OfflineAlertJobService', () => {
  let service: OfflineAlertJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfflineAlertJobService],
    }).compile();

    service = module.get<OfflineAlertJobService>(OfflineAlertJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
