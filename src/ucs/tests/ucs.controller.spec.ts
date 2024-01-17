import { Test, TestingModule } from '@nestjs/testing';
import { UcsController } from '../ucs.controller';
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
import { getConnectionToken } from '@nestjs/mongoose';
import { Role } from 'src/auth/models/Role';
jest.mock('../ucs.service');

describe('UcsController', () => {
  let controller: UcsController;
  let service: UcsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UcsController],
      providers: [
        UcsService,
        {
          provide: getConnectionToken('Database'),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UcsController>(UcsController);
    service = module.get<UcsService>(UcsService);
    jest.clearAllMocks();
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe(`User - ${Role.SUPER_ADMIN}`, () => {
    describe('create', () => {
      let result: Uc;
      let dto: CreateUcDto;
      let currentUser: UserFromJwt;

      beforeEach(async () => {
        dto = ucDtoStubs();
        currentUser = currentUserStub();
        result = await controller.create(dto, currentUser);
      });

      it('should return a uc', () => {
        expect(result).toMatchObject(ucStubs(dto));
      });

      it('should return a uc with id', () => {
        expect(result._id).toBeDefined();
      });

      it('should call uc service', () => {
        expect(service.create).toBeCalledWith(dto, currentUser);
      });
    });

    describe('findAllPaginated', () => {
      let result: { data: Uc[]; pageInfo: any };
      let dto: CreateUcDto;
      let currentUser: UserFromJwt;
      let query: QueryFindAllPaginateDto;

      beforeEach(async () => {
        dto = ucDtoStubs();
        currentUser = currentUserStub();
        result = await controller.findAllPaginated(query, currentUser);
      });

      it('should return ucs array', () => {
        expect(result).toMatchObject({ data: [ucStubs(dto)], pageInfo: {} });
      });

      it('should call uc service', () => {
        expect(service.findPaginated).toBeCalledWith(currentUser, query);
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
        result = await controller.findAll(query, currentUser);
      });

      it('should return ucs array', () => {
        expect(result).toMatchObject([ucStubs(dto)]);
      });

      it('should call uc service', () => {
        expect(service.findAll).toBeCalledWith(currentUser, query);
      });
    });

    describe('findOne', () => {
      let result: Uc;
      let dto: CreateUcDto;

      beforeEach(async () => {
        dto = ucDtoStubs();
        result = await controller.findOne(ucStubs(dto)._id.toString());
      });

      it('should return uc with correct id', () => {
        expect(result._id).toEqual(ucStubs(dto)._id);
      });

      it('Should call uc service', () => {
        expect(service.findByIdPopulate).toBeCalledWith(
          ucStubs(dto)._id.toString(),
        );
      });
    });

    describe('update', () => {
      let result: Uc;
      let dto: UpdateUcDto;
      let currentUser: UserFromJwt;
      const id = '1';

      beforeEach(async () => {
        dto = ucDtoStubs({ ucCode: '123' });
        currentUser = currentUserStub();
        result = await controller.update(id, dto, currentUser);
      });

      it('should return uc updated', () => {
        expect(result.ucCode).toEqual(dto.ucCode);
      });

      it('should call uc service', () => {
        expect(service.update).toBeCalledWith(id, dto, currentUser);
      });
    });

    describe('removeOne', () => {
      let dto: CreateUcDto;

      beforeEach(async () => {
        dto = ucDtoStubs();
        await controller.remove(ucStubs(dto)._id.toString());
      });

      it('Should call uc service', () => {
        expect(service.removeOne).toBeCalledWith(ucStubs(dto)._id.toString());
      });
    });

    describe('removeMany', () => {
      let dto: CreateUcDto;

      beforeEach(async () => {
        dto = ucDtoStubs();
        await controller.removeMany(ucStubs(dto)._id.toString());
      });

      it('Should call uc service', () => {
        expect(service.removeMany).toBeCalledWith([
          ucStubs(dto)._id.toString(),
        ]);
      });
    });
  });
});
