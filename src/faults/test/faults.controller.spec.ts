import { Test, TestingModule } from '@nestjs/testing';
import { FaultsController } from '../faults.controller';
import { FaultsService } from '../faults.service';

describe('FaultsController', () => {
  let controller: FaultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaultsController],
      providers: [{ provide: FaultsService, useValue: {} }],
    }).compile();

    controller = module.get<FaultsController>(FaultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
