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
jest.mock('../area.service');

const user: UserFromJwt = userStub();

describe('AreaController', () => {
  let controller: AreaController;
  let service: AreaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreaController],
      providers: [AreaService],
    }).compile();

    controller = module.get<AreaController>(AreaController);
    service = module.get<AreaService>(AreaService);
    jest.clearAllMocks();
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
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
      result = await controller.create({ ...dto, points: parsedPoints }, user);
    });

    it('should return a area', () => {
      expect(result).toMatchObject({ ...dto, points: parsedPoints });
    });

    it('should return a area with id', () => {
      expect(result._id).toBeDefined();
    });

    it('should call area service', () => {
      expect(service.create).toBeCalledWith(
        { ...dto, points: parsedPoints },
        user,
      );
    });
  });

  describe('findAll', () => {
    let result: Area[];
    let dto: CreateAreaDto;

    beforeEach(async () => {
      dto = areaDtoStubs();
      result = await controller.findAll(user);
    });

    it('should return areas array', () => {
      expect(result).toEqual([areaStubs(dto)]);
    });

    it('should call area service', () => {
      expect(service.findAll).toBeCalled();
    });
  });

  describe('findOne', () => {
    let result: Area;
    let dto: CreateAreaDto;

    beforeEach(async () => {
      dto = areaDtoStubs();
      result = await controller.findOne(areaStubs(dto)._id.toString());
    });

    it('should return area with correct id', () => {
      expect(result._id).toEqual(areaStubs(dto)._id);
    });

    it('Should call area service', () => {
      expect(service.findOne).toBeCalledWith(areaStubs(dto)._id.toString());
    });
  });

  describe('update', () => {
    let result: Area;
    let dto: UpdateAreaDto;
    const id = '1';

    beforeEach(async () => {
      dto = areaDtoStubs({ name: 'updated' });
      result = await controller.update(id, dto, user);
    });

    it('should return area updated', () => {
      expect(result.name).toEqual(dto.name);
    });

    it('should call area service', () => {
      expect(service.update).toBeCalledWith(id, dto, user);
    });
  });

  describe('remove', () => {
    let dto: RemoveAreaDto;

    beforeEach(async () => {
      dto = areaDtoStubs();
      await controller.remove(areaStubs(dto)._id.toString());
    });

    it('Should call area service', () => {
      expect(service.remove).toBeCalledWith([areaStubs(dto)._id.toString()]);
    });
  });
});
