import { Test, TestingModule } from '@nestjs/testing';
import { ChangelogsController } from '../changelog.controller';
import { ChangelogsRepository } from '../changelog.repository';
import { ChangelogsService } from '../changelog.service';
import { CreateChangelogDto } from '../dto/create-changelogs.dto';
import { UpdateChangelogDto } from '../dto/update-changelogs.dto';
import { Changelog } from '../entities/changelogs.entity';
import { createChangeLogWithId } from '../stubs/changelog.stub';
import { createChangelogDto } from '../stubs/changelogDTO.stub';
import { updateChangelogDto } from '../stubs/updateChangelogDTO.stub';
jest.mock('../changelog.repository');

describe('ChangelogsService', () => {
  let service: ChangelogsService;
  let repository: ChangelogsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangelogsController],
      providers: [ChangelogsService, ChangelogsRepository],
    }).compile();

    service = module.get<ChangelogsService>(ChangelogsService);
    repository = module.get<ChangelogsRepository>(ChangelogsRepository);
    jest.clearAllMocks();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  it('should be defined repository', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    let result: Changelog;
    let dto: CreateChangelogDto;

    beforeEach(async () => {
      dto = createChangelogDto();
      result = await service.create(dto);
    });

    it('should return a Changelog', () => {
      expect(result).toMatchObject(dto);
    });

    it('should return a Changelog with id', () => {
      expect(result._id).toBeDefined();
    });

    it('Should call changelogs repository', () => {
      expect(repository.create).toBeCalledWith(dto);
    });
  });

  describe('findAll', () => {
    let result: Changelog[];
    let dto: CreateChangelogDto;

    beforeEach(async () => {
      dto = createChangelogDto();
      result = await service.findAll();
    });

    it('should return changelogs array', () => {
      expect(result).toEqual([createChangeLogWithId(dto)]);
    });

    it('Should call changelogs repository', () => {
      expect(repository.find).toBeCalled();
    });
  });

  describe('findOne', () => {
    let result: Changelog;
    let dto: CreateChangelogDto;
    let id: string;

    beforeEach(async () => {
      dto = createChangelogDto();
      id = createChangeLogWithId(dto)._id.toString();
      result = await service.findOne(id);
    });

    it('should return changelog with correct id', () => {
      expect(result).toEqual(createChangeLogWithId(dto));
    });

    it('Should call changelogs repository', () => {
      expect(repository.findOne).toBeCalledWith({ _id: id });
    });
  });

  describe('update', () => {
    let result: Changelog;
    let dto: UpdateChangelogDto;
    const id = '1';

    beforeEach(async () => {
      dto = updateChangelogDto({ description: 'updated' });
      result = await service.update(id, dto);
    });

    it('should return changelog updated', () => {
      expect(result.description).toEqual(dto.description);
    });

    it('should call changelogs repository', () => {
      expect(repository.findOneAndUpdate).toBeCalledWith({ _id: id }, dto);
    });
  });

  describe('remove', () => {
    let dto: CreateChangelogDto;
    let id: string;

    beforeEach(async () => {
      dto = createChangelogDto();
      id = createChangeLogWithId(dto)._id.toString();
      await service.remove(id);
    });

    it('Should call changelogs repository', () => {
      expect(repository.delete).toBeCalledWith(id);
    });
  });
});
