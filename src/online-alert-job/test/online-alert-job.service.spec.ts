import { Test, TestingModule } from '@nestjs/testing';
import { OnlineAlertJobService } from '../online-alert-job.service';

describe('OnlineAlertJobService', () => {
  let service: OnlineAlertJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnlineAlertJobService],
    }).compile();

    service = module.get<OnlineAlertJobService>(OnlineAlertJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
