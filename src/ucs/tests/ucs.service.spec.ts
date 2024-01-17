import { Test, TestingModule } from '@nestjs/testing';
import { UcsController } from '../ucs.controller';
import { Types } from 'mongoose';
import { UcsService } from '../ucs.service';
import { Uc } from '../entities/uc.entity';
import { CreateUcDto } from '../dto/create-uc.dto';
import { ucDtoStubs } from '../stubs/ucDto.stub';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { currentUserStub } from '../stubs/currentUser.stub';
import { ucStubs } from '../stubs/uc.stub';
import {
  QueryFindAllDto,
  QueryFindAllPaginateDto,
} from '../dto/queryFindAll.dto';
import { UpdateUcDto } from '../dto/update-uc.dto';
import { UcsRepository } from '../ucs.repository';
import { TransformersService } from 'src/transformers/transformers.service';
import { ClientsService } from 'src/clients/clients.service';
import { DevicesGbService } from 'src/devices-gb/devices-gb.service';
import { NotificationService } from 'src/notification/notification.service';
import { UsersService } from 'src/users/users.service';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { deviceGBStub } from '../stubs/deviceGB.stub';
import { UcdisabledHistoryService } from 'src/ucdisabled-history/ucdisabled-history.service';
import { getConnectionToken } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/common';
import { CreateDevicesGbDto } from 'src/devices-gb/dto/create-devices-gb.dto';
import { Role } from 'src/auth/models/Role';

jest.mock('../ucs.repository');
jest.mock('src/ucs/__mocks__/devices-gb.repository.ts');
jest.mock('src/transformers/transformers.service');
jest.mock('src/users/users.service');
jest.mock('src/clients/clients.service');
jest.mock('src/notification/notification.service');
jest.mock('src/influx-buckets/influx-buckets.service');
jest.mock('src/ucdisabled-history/ucdisabled-history.service');

const mockSession = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
};

describe('UcsService', () => {
  let service: UcsService;
  let repository: UcsRepository;
  let transformersService: TransformersService;
  let clientsService: ClientsService;
  let devicesGbService: DevicesGbService;
  let ucDisabledHistoryService: UcdisabledHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UcsController],
      providers: [
        UcsService,
        UcsRepository,
        TransformersService,
        ClientsService,
        UsersService,
        {
          provide: DevicesGbService,
          useValue: {
            findByIdPopulate: jest.fn().mockResolvedValue(deviceGBStub()),
            create: jest.fn().mockResolvedValue(deviceGBStub()),
            findOne: jest.fn().mockResolvedValue(deviceGBStub()),
            migrateDevice: jest.fn(),
          },
        },
        NotificationService,
        InfluxBucketsService,
        UcdisabledHistoryService,
        {
          provide: getConnectionToken('Database'),
          useValue: {
            startSession: jest.fn().mockReturnValue(mockSession),
          },
        },
        {
          provide: CACHE_MANAGER,
          useFactory: jest.fn(),
          useValue: { del: jest.fn(), set: jest.fn() },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UcsService>(UcsService);
    repository = module.get<UcsRepository>(UcsRepository);
    transformersService = module.get<TransformersService>(TransformersService);
    clientsService = module.get<ClientsService>(ClientsService);
    devicesGbService = module.get<DevicesGbService>(DevicesGbService);
    ucDisabledHistoryService = module.get<UcdisabledHistoryService>(
      UcdisabledHistoryService,
    );
    jest.clearAllMocks();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined transformersService', () => {
    expect(transformersService).toBeDefined();
  });

  it('should be defined clientsService', () => {
    expect(clientsService).toBeDefined();
  });

  it('should be defined devicesGbService', () => {
    expect(devicesGbService).toBeDefined();
  });

  it('should be defined ucDisabledHistoryService', () => {
    expect(ucDisabledHistoryService).toBeDefined();
  });

  describe('USER Role.SUPERADMIN', () => {
    describe('create', () => {
      let result: Uc;
      let dto: CreateUcDto;
      let currentUser: UserFromJwt;
      let location: { type: string; coordinates: number[] };
      let clientId: string;
      let timeZone: string;

      beforeEach(async () => {
        dto = ucDtoStubs();
        currentUser = currentUserStub();
        location = {
          type: 'Point',
          coordinates: [dto.longitude, dto.latitude],
        };
        clientId = dto.clientId;
        timeZone = 'Etc/GMT';
        result = await service.create(dto, currentUser);
      });

      it('should return a uc', () => {
        expect(result).toMatchObject(ucStubs(dto));
      });

      it('should return a uc with id', () => {
        expect(result._id).toBeDefined();
      });

      it('should call uc repository', () => {
        expect(repository.create).toBeCalledWith({
          ...dto,
          location,
          clientId,
          timeZone,
          isCutted: false,
        });
      });

      it('should call uc repository countByDeviceId', () => {
        expect(repository.countByDeviceId).toBeCalledWith(
          dto.deviceId.toString(),
        );
      });
    });

    describe('findAllPaginated', () => {
      let result: { data: Uc[]; pageInfo: any };
      let dto: CreateUcDto;
      let currentUser: UserFromJwt;
      let query: QueryFindAllPaginateDto;
      let spyApplyPaginationClientFilterByRole;
      let spyRepositoryFindPaginated;

      beforeEach(async () => {
        dto = ucDtoStubs();
        currentUser = currentUserStub();
        query = {};
        spyApplyPaginationClientFilterByRole = jest.spyOn(
          service,
          'applyPaginationClientFilterByRole',
        );
        spyRepositoryFindPaginated = jest.spyOn(repository, 'findPaginated');
        result = await service.findPaginated(currentUser, query);
      });

      it('should return ucs array', () => {
        expect(result).toMatchObject({ data: [ucStubs(dto)], pageInfo: {} });
      });

      it('should applyPaginationClientFilterByRole return nothing', () => {
        expect(spyApplyPaginationClientFilterByRole).toReturnWith({});
      });

      it('should call spyRepositoryFindPaginated', () => {
        expect(spyRepositoryFindPaginated).toHaveBeenCalledWith(
          {
            $and: [
              {
                $and: [{}],
              },
            ],
          },
          [{ $sort: { it: 1 } }],
        );
      });
    });

    describe('applyPaginationClientFilterByRole', () => {
      let result;
      let currentUser: UserFromJwt;

      beforeEach(async () => {
        currentUser = { ...currentUserStub(), accessLevel: Role.MANAGER };

        result = await service.applyPaginationClientFilterByRole({
          currentUser,
        });
      });

      it('should return nothing', () => {
        expect(result).toMatchObject({});
      });
    });

    describe('findAll', () => {
      let result: Uc[];
      let dto: CreateUcDto;
      let currentUser: UserFromJwt;
      let query: QueryFindAllDto;

      beforeEach(async () => {
        dto = ucDtoStubs();
        currentUser = currentUserStub();
        query = {
          clientId: dto.clientId,
          allows: undefined,
          deviceType: undefined,
          transformerId: undefined,
        };
        result = await service.findAll(currentUser, query);
      });

      it('should return ucs array', () => {
        expect(result).toMatchObject([ucStubs(dto)]);
      });

      //   //TODO
      //   //Criar testes para os demais casos de query
      //   //Testar os populates se estão sendo chamados corretamente
    });

    describe('findByIdPopulate', () => {
      let result: Uc;
      let dto: CreateUcDto;
      let populate: string[];

      beforeEach(async () => {
        dto = ucDtoStubs();
        populate = ['deviceId', 'lastReceived', 'settings'];
        result = await service.findByIdPopulate(
          ucStubs(dto)._id.toString(),
          populate,
        );
      });

      it('should return uc with correct id', () => {
        expect(result._id).toEqual(ucStubs(dto)._id);
      });

      it('Should call uc repository (findByIdWithPopulate)', () => {
        expect(repository.findByIdWithPopulate).toBeCalledWith(
          { _id: ucStubs(dto)._id.toString() },
          populate,
        );
      });
    });

    describe('findById', () => {
      let result: Uc;
      let dto: CreateUcDto;

      beforeEach(async () => {
        dto = ucDtoStubs();
        result = await service.findById(ucStubs(dto)._id.toString());
      });

      it('should return uc with correct id', () => {
        expect(result._id).toEqual(ucStubs(dto)._id);
      });

      it('Should call uc repository (findOne)', () => {
        expect(repository.findOne).toBeCalledWith({
          _id: ucStubs(dto)._id.toString(),
        });
      });
    });

    describe('update', () => {
      let result: Uc;
      let dto: UpdateUcDto;
      let currentUser: UserFromJwt;
      let location: { type: string; coordinates: number[] };
      let clientId: string;
      let timeZone: string;
      const id = '1';

      beforeEach(async () => {
        dto = ucDtoStubs({ ucCode: '123' });
        currentUser = currentUserStub();
        location = {
          type: 'Point',
          coordinates: [dto.longitude, dto.latitude],
        };
        clientId = dto.clientId;
        timeZone = 'Etc/GMT';
        result = await service.update(id, dto, currentUser);
      });

      it('should return uc updated', () => {
        expect(result.ucCode).toEqual(dto.ucCode);
      });

      it('should call uc repository (findOneAndUpdate)', () => {
        expect(repository.findOneAndUpdate).toBeCalledWith(
          { _id: id },
          { ...dto, location, clientId, timeZone },
        );
      });

      it('should call uc repository (countByUcByDeviceId)', () => {
        expect(repository.countByUcByDeviceId).toBeCalledWith(
          dto.deviceId.toString(),
          id,
        );
      });
    });

    describe('disable', () => {
      let result;
      const id = '1';
      const deleteData = false;
      let user: UserFromJwt;

      beforeEach(async () => {
        user = currentUserStub();
        result = await service.disable(id, deleteData, user);
      });

      it('Should call uc migrateDevice', () => {
        expect(devicesGbService.migrateDevice).toBeCalledWith({
          oldDevice: deviceGBStub(),
          newDevice: deviceGBStub(),
          deleteOldData: false,
          uc: {
            ...ucStubs(ucDtoStubs()),
            deviceId: deviceGBStub(),
          },
          hardwareSerial: null,
          transactionSession: mockSession,
        });
      });

      it('Should call devicesGbService.create', () => {
        const device: CreateDevicesGbDto = {
          clientId: ucDtoStubs().clientId,
          devId: `ucd-${ucDtoStubs().ucCode}`,
          bucketId: deviceGBStub().bucketId.toString(),
          name: `UC ${ucStubs(ucDtoStubs()).ucCode} desativada`,
          allows: deviceGBStub().allows,
          communication: 'PIMA',
          type: 'LoRa',
          databaseId: expect.anything(),
        };

        expect(devicesGbService.create).toBeCalledWith(device, mockSession);
      });
    });
  });

  describe('USER Role.COMMERCIAL', () => {
    const currentUser: UserFromJwt = {
      ...currentUserStub(),
      accessLevel: Role.ADMIN,
    };

    describe('findAllPaginated', () => {
      let result: { data: Uc[]; pageInfo: any };
      let dto: CreateUcDto;
      let query: QueryFindAllPaginateDto;
      let spyRepositoryFindPaginated;

      beforeEach(async () => {
        dto = ucDtoStubs();
        query = {};
        spyRepositoryFindPaginated = jest.spyOn(repository, 'findPaginated');

        result = await service.findPaginated(currentUser, query);
      });

      it('should return ucs array', () => {
        expect(result).toMatchObject({ data: [ucStubs(dto)], pageInfo: {} });
      });

      it('should call spyRepositoryFindPaginated', () => {
        expect(spyRepositoryFindPaginated).toHaveBeenCalledWith(
          {
            $and: [
              {
                $and: [
                  {
                    $or: [
                      {
                        'clientId._id': new Types.ObjectId(
                          currentUser.clientId,
                        ),
                      },
                      {
                        'clientId.parentId': new Types.ObjectId(
                          currentUser.clientId,
                        ),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          [{ $sort: { it: 1 } }],
        );
      });
    });

    describe('applyPaginationClientFilterByRole', () => {
      let result;

      beforeEach(async () => {
        result = service.applyPaginationClientFilterByRole({
          currentUser,
        });
      });

      it('should return only clientId._id & clientId.parentId', () => {
        expect(result).toMatchObject({
          $or: [
            {
              'clientId._id': new Types.ObjectId(currentUser.clientId),
            },
            {
              'clientId.parentId': new Types.ObjectId(currentUser.clientId),
            },
          ],
        });
      });
    });
  });

  describe('USER Role.VIEWER', () => {
    const currentUser: UserFromJwt = {
      ...currentUserStub(),
      accessLevel: Role.VIEWER,
    };

    describe('findAllPaginated', () => {
      let result: { data: Uc[]; pageInfo: any };
      let dto: CreateUcDto;
      let query: QueryFindAllPaginateDto;
      let spyRepositoryFindPaginated;

      beforeEach(async () => {
        dto = ucDtoStubs();
        query = {};
        spyRepositoryFindPaginated = jest.spyOn(repository, 'findPaginated');

        result = await service.findPaginated(currentUser, query);
      });

      it('should return ucs array', () => {
        expect(result).toMatchObject({ data: [ucStubs(dto)], pageInfo: {} });
      });

      it('should call spyRepositoryFindPaginated', () => {
        expect(spyRepositoryFindPaginated).toHaveBeenCalledWith(
          {
            $and: [
              {
                $and: [
                  {
                    'clientId._id': new Types.ObjectId(currentUser.clientId),
                  },
                ],
              },
            ],
          },
          [{ $sort: { it: 1 } }],
        );
      });
    });

    describe('applyPaginationClientFilterByRole', () => {
      let result;

      beforeEach(() => {
        result = service.applyPaginationClientFilterByRole({
          currentUser,
        });
      });

      it('should return only ClientId', () => {
        expect(result).toMatchObject({
          'clientId._id': new Types.ObjectId(currentUser.clientId),
        });
      });
    });
  });

  describe('USER Role.MANAGER', () => {
    const currentUser: UserFromJwt = {
      ...currentUserStub(),
      accessLevel: Role.MANAGER,
    };

    describe('findAllPaginated', () => {
      let result: { data: Uc[]; pageInfo: any };
      let dto: CreateUcDto;
      let query: QueryFindAllPaginateDto;
      let spyRepositoryFindPaginated;

      beforeEach(async () => {
        dto = ucDtoStubs();
        spyRepositoryFindPaginated = jest.spyOn(repository, 'findPaginated');

        query = {};
        result = await service.findPaginated(currentUser, query);
      });

      it('should return ucs array', () => {
        expect(result).toMatchObject({ data: [ucStubs(dto)], pageInfo: {} });
      });

      it('should call spyRepositoryFindPaginated', () => {
        expect(spyRepositoryFindPaginated).toHaveBeenCalledWith(
          {
            $and: [
              {
                $and: [
                  {
                    'clientId._id': new Types.ObjectId(currentUser.clientId),
                  },
                ],
              },
            ],
          },
          [{ $sort: { it: 1 } }],
        );
      });
    });

    describe('applyPaginationClientFilterByRole', () => {
      let result;

      beforeEach(async () => {
        result = await service.applyPaginationClientFilterByRole({
          currentUser,
        });
      });

      it('should return only ClientId', () => {
        expect(result).toMatchObject({
          'clientId._id': new Types.ObjectId(currentUser.clientId),
        });
      });
    });
  });
});
