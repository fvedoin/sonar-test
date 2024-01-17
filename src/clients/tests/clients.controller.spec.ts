import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from '../clients.controller';
import { ClientsService } from '../clients.service';
import { clientDtoStubs } from '../stubs/clientDTO.stub';
import { Client } from '../entities/client.entity';
import { CreateClientDto } from '../dto/create-client.dto';
import { UserFromJwt } from '../../auth/models/UserFromJwt';
import { userStub } from '../stubs/user.stub';
jest.mock('../clients.service');

const user: UserFromJwt = userStub();

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [ClientsService],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    service = module.get<ClientsService>(ClientsService);
    jest.clearAllMocks();
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let result: Client;
    let dto: CreateClientDto;

    beforeEach(async () => {
      dto = clientDtoStubs();
      result = await controller.create(dto, user);
      await controller.create({ parentId: result._id, ...dto }, user);
    });

    it('should return a client', async () => {
      expect(result).toMatchObject(dto);
    });

    it('should return a client with id', () => {
      expect(result._id).toBeDefined();
    });

    it('should call client service', () => {
      expect(service.create).toBeCalledWith(dto, user);
    });
  });
});
