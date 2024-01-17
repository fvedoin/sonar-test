import { Test, TestingModule } from '@nestjs/testing';
import { UpdateNewsDto } from '../dto/update-news.dto';
import { News } from '../entities/news.entity';
import { NewsController } from '../news.controller';
import { NewsService } from '../news.service';
import { file } from '../stubs/file.stub';
import { newsStub } from '../stubs/news.stub';
import { updateNewsDto } from '../stubs/updateNewsDTO.stub';
jest.mock('../news.service');

describe('NewsController', () => {
  let controller: NewsController;
  let service: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [NewsService],
    }).compile();

    controller = module.get<NewsController>(NewsController);
    service = module.get<NewsService>(NewsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let result: News;

    beforeEach(async () => {
      result = await controller.create(newsStub(), file());
    });

    it('should create news', () => {
      expect(result).toMatchObject(newsStub());
    });

    it('should return a news with id', () => {
      expect(result._id).toBeDefined();
    });

    it('Should call news service', () => {
      expect(service.create).toBeCalledWith(newsStub(), file());
    });
  });

  describe('findAll', () => {
    let result: News[];

    beforeEach(async () => {
      result = await controller.findAll();
    });
    it('should return news array', async () => {
      expect(result).toEqual([newsStub()]);
    });

    it('Should call news service', () => {
      expect(service.findAll).toBeCalled();
    });
  });

  describe('findOne', () => {
    let result: News;

    beforeEach(async () => {
      result = await controller.findOne(newsStub()._id.toString());
    });

    it('should return news with correct id', () => {
      expect(result._id).toEqual(newsStub()._id);
    });

    it('Should call news service', () => {
      expect(service.findOne).toBeCalledWith(newsStub()._id.toString());
    });
  });

  describe('update', () => {
    let result: News;
    let dto: UpdateNewsDto;
    const id = '1';

    beforeEach(async () => {
      dto = updateNewsDto({ description: 'updated' });
    });

    it('should return news updated', async () => {
      result = await controller.update(id, dto, null);
      expect(result.description).toEqual(dto.description);
    });
    it('should update new file', async () => {
      result = await controller.update(id, dto, file());
      expect(result.description).toEqual(dto.description);
    });
  });
  describe('remove', () => {
    const id = newsStub()._id.toString();
    beforeEach(async () => {
      await controller.remove(id);
    });
    it('should remove news', () => {
      expect(service.remove).toHaveBeenCalledWith([id]);
    });
  });
});
