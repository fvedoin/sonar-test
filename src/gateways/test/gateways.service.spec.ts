import { Test, TestingModule } from '@nestjs/testing';
import MockAdapter from 'axios-mock-adapter';
import { TtnService } from 'src/common/services/ttn.service';
import { UserFromJwt } from '../../auth/models/UserFromJwt';
import { Gateway } from '../entities/gateway.entity';
import { GatewaysController } from '../gateways.controller';
import { GatewaysRepository } from '../gateways.repository';
import { GatewaysService } from '../gateways.service';
import { gatewayResponseStubFromTtn } from '../stubs/gateway.stub';
import { findFilteredGatewaysResponseStub } from '../stubs/gatewayFilteredClient.stub';
import { findOneResponseStub } from '../stubs/gatewayFindOne.stub';
import { linkGatewayDtoStub } from '../stubs/gatewayLink.stub';
import { userStub } from '../stubs/user.stub';
import { ClientsService } from 'src/clients/clients.service';

jest.mock('../gateways.repository');

const user: UserFromJwt = userStub();

describe('GatewaysService', () => {
  let service: GatewaysService;
  let repository: GatewaysRepository;
  let ttnMock: MockAdapter;

  beforeEach(async () => {
    ttnMock = new MockAdapter(TtnService);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewaysController],
      providers: [
        GatewaysService,
        GatewaysRepository,
        {
          provide: ClientsService,
          useValue: {
            findWhereAndPopulate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GatewaysService>(GatewaysService);
    repository = module.get<GatewaysRepository>(GatewaysRepository);
    jest.clearAllMocks();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    let result: Gateway[];

    beforeEach(async () => {
      ttnMock
        .onGet('gs/gateways/gateway_id/connection/stats')
        .reply(200, { data: { last_status_received_at: '2023-09-04' } });

      ttnMock
        .onGet(
          'gateways?field_mask=name,description,frequency_plan_ids,gateway_server_address',
        )
        .reply(200, { gateways: [gatewayResponseStubFromTtn] });

      result = await service.findAll(user);
    });

    it('should return gateways array', () => {
      expect(result).toEqual([gatewayResponseStubFromTtn]);
    });
  });

  describe('findOne', () => {
    let result: any;
    let ttnId: string;

    beforeEach(async () => {
      ttnId = 'poiuytrewq';
      ttnMock
        .onGet(`gateways/${ttnId}?field_mask=name,description`)
        .reply(200, { name: 'bjnkml', description: 'GatewayDescription' });

      result = await service.findOneWhere({ ttnId });
    });

    it('should return expected object', () => {
      expect(result).toEqual(findOneResponseStub);
    });
  });

  describe('filterByClients', () => {
    let result: any;
    let user: UserFromJwt;
    let clientId: string;

    beforeEach(async () => {
      user = userStub();
      clientId = '1';

      ttnMock
        .onGet('gateways?field_mask=name,description')
        .reply(200, { gateways: findFilteredGatewaysResponseStub });

      result = await service.filterByClients(user, clientId);
    });

    it('should return expected array of objects', () => {
      expect(result).toEqual(findFilteredGatewaysResponseStub);
    });
  });

  describe('update', () => {
    let result: Gateway;
    let ttnId: string;
    let linkGatewayDto: any;

    beforeEach(async () => {
      ttnId = 'poiuytrewq';
      linkGatewayDto = linkGatewayDtoStub;
      result = await service.link(ttnId, linkGatewayDto);
    });

    it('should return expected result', () => {
      expect(result).toEqual(findOneResponseStub);
    });
  });
});
