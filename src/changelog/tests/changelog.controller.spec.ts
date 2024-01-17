import { Test, TestingModule } from '@nestjs/testing';
import { ChangelogsController } from '../changelog.controller';
import { ChangelogsService } from '../changelog.service';
import { CreateChangelogDto } from '../dto/create-changelogs.dto';
import { UpdateChangelogDto } from '../dto/update-changelogs.dto';
import { Changelog } from '../entities/changelogs.entity';
import { createChangeLogWithId } from '../stubs/changelog.stub';
import { createChangelogDto } from '../stubs/changelogDTO.stub';
import { updateChangelogDto } from '../stubs/updateChangelogDTO.stub';
jest.mock('../changelog.service');

describe('ChangelogsController', () => {
  let controller: ChangelogsController;
  let service: ChangelogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangelogsController],
      providers: [ChangelogsService],
    }).compile();

    controller = module.get<ChangelogsController>(ChangelogsController);
    service = module.get<ChangelogsService>(ChangelogsService);
    jest.clearAllMocks();
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let result: Changelog;
    let dto: CreateChangelogDto;

    beforeEach(async () => {
      dto = createChangelogDto();
      result = await controller.create(dto);
    });

    it('should return a Changelog', () => {
      expect(result).toMatchObject(dto);
    });

    it('should return a Changelog with id', () => {
      expect(result._id).toBeDefined();
    });

    it('Should call changelogs service', () => {
      expect(service.create).toBeCalledWith(dto);
    });
  });

  describe('findAll', () => {
    let result: Changelog[];
    let dto: CreateChangelogDto;

    beforeEach(async () => {
      dto = createChangelogDto();
      result = await controller.findAll();
    });

    it('should return changelogs array', () => {
      expect(result).toEqual([createChangeLogWithId(dto)]);
    });

    it('Should call changelogs service', () => {
      expect(service.findAll).toBeCalled();
    });
  });

  describe('findOne', () => {
    let result: Changelog;
    let dto: CreateChangelogDto;

    beforeEach(async () => {
      dto = createChangelogDto();
      result = await controller.findOne(
        createChangeLogWithId(dto)._id.toString(),
      );
    });

    it('should return changelog with correct id', () => {
      expect(result).toEqual(createChangeLogWithId(dto));
    });

    it('Should call changelogs service', () => {
      expect(service.findOne).toBeCalledWith(
        createChangeLogWithId(dto)._id.toString(),
      );
    });
  });

  describe('update', () => {
    let result: Changelog;
    let dto: UpdateChangelogDto;
    const id = '1';

    beforeEach(async () => {
      dto = updateChangelogDto({ description: 'updated' });
      result = await controller.update(id, dto);
    });

    it('should return changelog updated', () => {
      expect(result.description).toEqual(dto.description);
    });

    it('should call update service with id and dto', () => {
      expect(service.update).toBeCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    let id: string;

    beforeEach(async () => {
      const dto = createChangelogDto();
      id = createChangeLogWithId(dto)._id.toString();
      await controller.remove(id);
    });

    it('Should call remove service with id', () => {
      expect(service.remove).toBeCalledWith(id);
    });
  });
});
