import { Test, TestingModule } from '@nestjs/testing';
import { OnlineAlertJobController } from '../online-alert-job.controller';
import { OnlineAlertJobService } from '../online-alert-job.service';

describe('OnlineAlertJobController', () => {
  let controller: OnlineAlertJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnlineAlertJobController],
      providers: [OnlineAlertJobService],
    }).compile();

    controller = module.get<OnlineAlertJobController>(OnlineAlertJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
