import { Test, TestingModule } from '@nestjs/testing';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { Gateway } from '../entities/gateway.entity';
import { GatewaysController } from '../gateways.controller';
import { GatewaysService } from '../gateways.service';
import { gatewayResponseStubFromTtn } from '../stubs/gateway.stub';
import { findFilteredGatewaysResponseStub } from '../stubs/gatewayFilteredClient.stub';
import { findOneResponseStub } from '../stubs/gatewayFindOne.stub';
import { linkGatewayDtoStub } from '../stubs/gatewayLink.stub';
import { userStub } from '../stubs/user.stub';
import { ClientsService } from 'src/clients/clients.service';
jest.mock('../gateways.service');

const user: UserFromJwt = userStub();

describe('GatewaysController', () => {
  let controller: GatewaysController;
  let service: GatewaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewaysController],
      providers: [
        GatewaysService,
        {
          provide: ClientsService,
          useValue: {
            findWhereAndPopulate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GatewaysController>(GatewaysController);
    service = module.get<GatewaysService>(GatewaysService);
    jest.clearAllMocks();
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    let result: Gateway[];

    beforeEach(async () => {
      result = await controller.findAll(user);
    });

    it('should return gateways array', () => {
      expect(result).toEqual([gatewayResponseStubFromTtn]);
    });

    it('should call gateway service', () => {
      expect(service.findAll).toBeCalled();
    });
  });

  describe('findOne', () => {
    let result: any;
    let ttnId: string;

    beforeEach(async () => {
      ttnId = 'poiuytrewq';
      result = await controller.findOne(ttnId);
    });

    it('should return expected object', () => {
      expect(result).toEqual(findOneResponseStub);
    });

    it('should call gateway service', () => {
      expect(service.findOne).toBeCalledWith(ttnId);
    });
  });

  describe('filterByClients', () => {
    let result: Gateway;
    let user: UserFromJwt;
    let clientId: string;

    beforeEach(async () => {
      user = userStub();
      clientId = '1';
      result = await controller.filterByClients(user, clientId);
    });

    it('should return expected array of objects', () => {
      expect(result).toEqual(findFilteredGatewaysResponseStub);
    });

    it('should call gateway service', () => {
      expect(service.filterByClients).toBeCalledWith(user, clientId);
    });
  });

  describe('update', () => {
    let result: Gateway;
    let ttnId: string;
    let linkGatewayDto: any;

    beforeEach(async () => {
      ttnId = 'poiuytrewq';
      linkGatewayDto = linkGatewayDtoStub;
      result = await controller.update(ttnId, linkGatewayDto);
    });

    it('should return expected result', () => {
      expect(result).toEqual(findOneResponseStub);
    });

    it('should call gatewaysService.link', () => {
      expect(service.link).toBeCalledWith(ttnId, linkGatewayDto);
    });
  });
});
