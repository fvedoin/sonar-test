import { Test, TestingModule } from '@nestjs/testing';
import { AlertGatewayController } from '../alert-gateway.controller';
import { AlertGatewayService } from '../alert-gateway.service';
import { alertGatewayDtoStubs } from '../stubs/alertGatewayDTO.stub';
import { alertGatewayStubs } from '../stubs/alertGateway.stub';
import { RemoveAlertGatewayDto } from '../dto/remove-alert-gateway.dto';
jest.mock('../alert-gateway.service');

describe('AlertGatewayController', () => {
  let controller: AlertGatewayController;
  let service: AlertGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertGatewayController],
      providers: [AlertGatewayService],
    }).compile();

    controller = module.get<AlertGatewayController>(AlertGatewayController);
    service = module.get<AlertGatewayService>(AlertGatewayService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('remove', () => {
    let dto: RemoveAlertGatewayDto;

    beforeEach(async () => {
      dto = alertGatewayDtoStubs();
      await controller.remove(alertGatewayStubs(dto)._id.toString());
    });

    it('Should call alertGateway remove service', () => {
      expect(service.remove).toBeCalledWith([
        alertGatewayStubs(dto)._id.toString(),
      ]);
    });
  });
});
