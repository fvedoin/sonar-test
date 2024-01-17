import { Test, TestingModule } from '@nestjs/testing';
import { TransformersController } from '../transformers.controller';
import { TransformersService } from '../transformers.service';
import { ClientsService } from 'src/clients/clients.service';
import { Transformer } from '../entities/transformer.entity';
import { transformersAggregateStub } from '../stubs/transformerAggregateStub';
import { userDTOStub } from '../stubs/userDTO.stub';
import { UsersService } from 'src/users/users.service';

jest.mock('../transformers.service');
jest.mock('src/clients/clients.service');

describe('TransformersController', () => {
  let controller: TransformersController;
  let service: TransformersService;
  let clientsService: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransformersController],
      providers: [
        TransformersService,
        ClientsService,
        {
          provide: UsersService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TransformersController>(TransformersController);
    service = module.get<TransformersService>(TransformersService);
    clientsService = module.get<ClientsService>(ClientsService);
    jest.clearAllMocks();
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  it('should be defined clientsService', () => {
    expect(clientsService).toBeDefined();
  });

  describe('filterTransformersDevice', () => {
    let result: { data: Transformer[]; pageInfo: { count: number } };
    const clientId = userDTOStub().clientId.toString();

    beforeEach(async () => {
      result = await controller.filterTransformersDevice(clientId);
    });

    it('should return transformers array', () => {
      expect(result).toEqual({
        data: [transformersAggregateStub()],
        pageInfo: {
          count: 1,
        },
      });
    });

    it('should call transformer service', () => {
      expect(service.filterTransformersDevice).toBeCalled();
    });
  });
});
