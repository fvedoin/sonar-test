import { Test, TestingModule } from '@nestjs/testing';
import { AreaController } from '../area.controller';
import { AreaService } from '../area.service';
import { areaStubs } from '../stubs/area.stub';
import { areaDtoStubs } from '../stubs/areaDTO.stub';
import { Area } from '../entities/area.entity';
import { CreateAreaDto } from '../dto/create-area.dto';
import { UserFromJwt } from '../../auth/models/UserFromJwt';
import { userStub } from '../stubs/user.stub';
import { UpdateAreaDto } from '../dto/update-area.dto';
import { RemoveAreaDto } from '../dto/remove-area.dto';
import { AreaRepository } from '../area.repository';
import { areaPopulateStub } from '../stubs/areaPopulate.stub';
jest.mock('../area.repository');

const user: UserFromJwt = userStub();

describe('AreaService', () => {
  let service: AreaService;
  let repository: AreaRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaController],
      providers: [AreaService, AreaRepository],
    }).compile();

    service = module.get<AreaService>(AreaService);
    repository = module.get<AreaRepository>(AreaRepository);
    jest.clearAllMocks();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let result: Area;
    let dto: CreateAreaDto;
    let parsedPoints = [];

    beforeEach(async () => {
      dto = areaDtoStubs();
      parsedPoints = dto.points.map(({ lng, lat }) => ({
        type: 'Point',
        coordinates: [lng, lat],
      }));
      result = await service.create({ ...dto, points: parsedPoints }, user);
    });

    it('should return a area', () => {
      expect(result).toMatchObject({ ...dto, points: parsedPoints });
    });

    it('should return a area with id', () => {
      expect(result._id).toBeDefined();
    });
  });

  describe('create Role.SUPERADMIN', () => {
    let result: Area;
    let dto: CreateAreaDto;
    let parsedPoints = [];

    beforeEach(async () => {
      dto = areaDtoStubs();
      parsedPoints = dto.points.map(({ lng, lat }) => ({
        type: 'Point',
        coordinates: [lng, lat],
      }));
      try {
        result = await service.create(
          { ...dto, clientId: null, points: parsedPoints },
          user,
        );
      } catch (error) {
        result = error.message;
      }
    });

    it('should get error', () => {
      expect(result).toBe('ClientId é obrigatório');
    });
  });

  describe('findAll', () => {
    let result: Area[];

    beforeEach(async () => {
      result = await service.findAll(user);
    });

    it('should return areas array', () => {
      expect(result).toEqual([areaPopulateStub()]);
    });

    it('should return array with clientId populate', () => {
      expect(result[0].clientId).toEqual(areaPopulateStub().clientId);
    });

    it('should call area repository', () => {
      expect(repository.findAllAndPopulate).toBeCalledWith(['clientId']);
    });
  });

  describe('findOne', () => {
    let result: Area;
    let dto: CreateAreaDto;
    let id: string;

    beforeEach(async () => {
      dto = areaDtoStubs();
      id = areaStubs(dto)._id.toString();
      result = await service.findOne(id);
    });

    it('should return area with correct id', () => {
      expect(result._id).toEqual(areaStubs(dto)._id);
    });

    it('Should call area repository', () => {
      expect(repository.findOne).toBeCalledWith({ _id: id });
    });
  });

  describe('update', () => {
    let result: Area;
    let dto: UpdateAreaDto;
    const id = '1';
    let parsedPoints = [];

    beforeEach(async () => {
      dto = areaDtoStubs({ name: 'updated' });
      parsedPoints = dto.points.map(() => ({
        type: 'Point',
        coordinates: [undefined, undefined],
      }));
      result = await service.update(id, { ...dto, points: parsedPoints }, user);
    });

    it('should return area updated', () => {
      expect(result.name).toEqual(dto.name);
    });

    it('should call area repository', () => {
      expect(repository.findOneAndUpdate).toBeCalledWith(
        { _id: id },
        { ...dto, points: parsedPoints },
      );
    });
  });

  describe('remove', () => {
    let dto: RemoveAreaDto;

    beforeEach(async () => {
      dto = areaDtoStubs();
      await service.remove([areaStubs(dto)._id.toString()]);
    });

    it('Should call area repository', () => {
      expect(repository.deleteMany).toBeCalledWith({
        _id: { $in: [areaStubs(dto)._id.toString()] },
      });
    });
  });
});
