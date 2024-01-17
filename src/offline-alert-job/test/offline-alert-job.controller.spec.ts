import { Test, TestingModule } from '@nestjs/testing';
import { OfflineAlertJobController } from '../offline-alert-job.controller';
import { OfflineAlertJobService } from '../offline-alert-job.service';

describe('OfflineAlertJobController', () => {
  let controller: OfflineAlertJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfflineAlertJobController],
      providers: [OfflineAlertJobService],
    }).compile();

    controller = module.get<OfflineAlertJobController>(
      OfflineAlertJobController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
