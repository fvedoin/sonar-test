import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from '../dashboard.controller';
import { DashboardService } from '../dashboard.service';
jest.mock('../dashboard.service');

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [DashboardService],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('lastHour', () => {
    let result: any;
    let clientId: string;

    beforeEach(async () => {
      clientId = '123';
      result = await controller.lastHour(clientId);
    });

    it('should return a dashboard', () => {
      expect(result[0].lastHour).toBeDefined();
      expect(result[0].status).toBeDefined();
      expect(result[0].ucCode).toBeDefined();
    });

    it('should call dashboard service', () => {
      expect(service.lastHour).toBeCalledWith(clientId);
    });
  });
});
