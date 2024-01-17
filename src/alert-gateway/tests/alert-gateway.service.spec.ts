import { Test, TestingModule } from '@nestjs/testing';
import { AlertGatewayService } from '../alert-gateway.service';
import { AlertGatewayRepository } from '../alert-gateway.repository';
import { alertGatewayDtoStubs } from '../stubs/alertGatewayDTO.stub';
import { alertGatewayStubs } from '../stubs/alertGateway.stub';
import { RemoveAlertGatewayDto } from '../dto/remove-alert-gateway.dto';
jest.mock('../alert-gateway.repository');

describe('AlertGatewayService', () => {
  let service: AlertGatewayService;
  let repository: AlertGatewayRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertGatewayService, AlertGatewayRepository],
    }).compile();

    service = module.get<AlertGatewayService>(AlertGatewayService);
    repository = module.get<AlertGatewayRepository>(AlertGatewayRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  describe('remove', () => {
    let dto: RemoveAlertGatewayDto;

    beforeEach(async () => {
      dto = alertGatewayDtoStubs();
      await service.remove([alertGatewayStubs(dto)._id.toString()]);
    });

    it('Should call alertGateway remove repository', () => {
      expect(repository.deleteMany).toBeCalledWith({
        _id: { $in: [alertGatewayStubs(dto)._id.toString()] },
      });
    });
  });
});
