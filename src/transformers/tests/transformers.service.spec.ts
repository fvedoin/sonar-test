import { Test, TestingModule } from '@nestjs/testing';
import { TransformersService } from '../transformers.service';
import { TransformersController } from '../transformers.controller';
import { TransformersRepository } from '../transformers.repository';
import { ClientsService } from 'src/clients/clients.service';
import { Transformer } from '../entities/transformer.entity';
import { transformersAggregateStub } from '../stubs/transformerAggregateStub';
import { userDTOStub } from '../stubs/userDTO.stub';
import { UsersService } from 'src/users/users.service';

jest.mock('../transformers.repository');
jest.mock('src/clients/clients.service');

describe('TransformersService', () => {
  let repository: TransformersRepository;
  let service: TransformersService;
  let clientsService: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransformersController],
      providers: [
        TransformersService,
        TransformersRepository,
        ClientsService,
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TransformersService>(TransformersService);
    repository = module.get<TransformersRepository>(TransformersRepository);
    clientsService = module.get<ClientsService>(ClientsService);
    jest.clearAllMocks();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined clientsService', () => {
    expect(clientsService).toBeDefined();
  });

  describe('filterTransformersDevice', () => {
    let result: { data: Transformer[]; pageInfo: { count: number } };

    const clientId = userDTOStub().clientId.toString();

    beforeEach(async () => {
      result = await service.filterTransformersDevice(clientId);
    });

    it('should return transformers array', () => {
      expect(result).toEqual({
        data: [transformersAggregateStub()],
        pageInfo: { count: 1 },
      });
    });

    it('Should call Transformers repository', () => {
      expect(repository.aggregate).toBeCalled();
    });
  });
});
