import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from '../clients.controller';
import { ClientsService } from '../clients.service';
import { clientDtoStubs } from '../stubs/clientDTO.stub';
import { Client } from '../entities/client.entity';
import { CreateClientDto } from '../dto/create-client.dto';
import { UserFromJwt } from '../../auth/models/UserFromJwt';
import { userStub } from '../stubs/user.stub';
import { ClientsRepository } from '../clients.repository';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { InfluxConnectionsService } from 'src/influx-connections/influx-connections.service';
jest.mock('../clients.repository');

const user: UserFromJwt = userStub();

describe('ClientsService', () => {
  it('should be defined user', () => {
    expect(user).toBeDefined();
  });
});

// O teste unitário de ClientsService não está disponível por causa da dependência circular entre ele e o InfluxBucketService.

/* describe('ClientsService', () => {
  let service: ClientsService;
  let repository: ClientsRepository;
  let influxBucketsService: InfluxBucketsService;
  let influxConnectionsService: InfluxConnectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        ClientsService,
        ClientsRepository,
        InfluxBucketsService,
        InfluxConnectionsService
      ]
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repository = module.get<ClientsRepository>(ClientsRepository);
    influxBucketsService = module.get<InfluxBucketsService>(InfluxBucketsService);
    influxConnectionsService = module.get<InfluxConnectionsService>(InfluxConnectionsService);
    jest.clearAllMocks();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  it('should be defined influx bucket service', () => {
    expect(influxBucketsService).toBeDefined();
  });

  it('should be defined influx connection service', () => {
    expect(influxConnectionsService).toBeDefined();
  });

  describe('create', () => {
    let result: Client;
    let dto: CreateClientDto;

    beforeEach(async () => {
      dto = clientDtoStubs();
      result = await service.create(dto, user);
      await service.create({ parentId: result._id, ...dto }, user);
    });

    it('should return a client', () => {
      expect(result).toMatchObject(dto);
    });

    it('should return a client with id', () => {
      expect(result._id).toBeDefined();
    });

    it('should call client repository', () => {
      expect(repository.create).toBeCalledWith(dto);
    });
  });
}); */
