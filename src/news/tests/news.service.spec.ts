import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from '../news.service';
import { NewsController } from '../news.controller';
import { NewsRepository } from '../news.repository';
import { newsStub } from '../stubs/news.stub';
import { file } from '../stubs/file.stub';
import { News } from '../entities/news.entity';
import { UpdateNewsDto } from '../dto/update-news.dto';
import { updateNewsDto } from '../stubs/updateNewsDTO.stub';
import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';

jest.mock('../news.repository');
jest.mock('fs/promises');

describe('ChangelogsService', () => {
  let service: NewsService;
  let repository: NewsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        NewsService,
        NewsRepository,
        {
          provide: AwsS3ManagerService,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    repository = module.get<NewsRepository>(NewsRepository);
    jest.clearAllMocks();
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    let result: News;

    beforeEach(async () => {
      result = await service.create(newsStub(), file());
    });

    it('should create news', () => {
      expect(result).toMatchObject(newsStub());
    });

    it('should return a news with id', () => {
      expect(result._id).toBeDefined();
    });

    it('Should call news service', () => {
      const pattern = `^news/\\d{13}-${file().originalname.replace(
        /\./,
        '\\.',
      )}$`;
      const regex = new RegExp(pattern);

      const newsDto = {
        ...newsStub(),
        image: expect.stringMatching(regex),
      };

      expect(repository.create).toBeCalledWith(newsDto);
    });
  });
  describe('findAll', () => {
    let result: News[];

    beforeEach(async () => {
      result = await service.findAll();
    });
    it('should return news array', async () => {
      expect(result).toEqual([newsStub()]);
    });
    it('Should call news service', () => {
      expect(repository.find).toBeCalled();
    });
  });
  describe('findOne', () => {
    let result: News;

    beforeEach(async () => {
      result = await service.findOne(newsStub()._id.toString());
    });

    it('should return news with correct id', () => {
      expect(result._id).toEqual(newsStub()._id);
    });

    it('Should call news service', () => {
      expect(repository.findOne).toBeCalledWith({
        _id: newsStub()._id.toString(),
      });
    });
  });
  describe('update', () => {
    let result: News;
    let dto: UpdateNewsDto;
    const id = '1';

    beforeEach(async () => {
      dto = updateNewsDto({ description: 'updated' });
      result = await service.update(id, dto, null);
    });

    it('should return news updated', async () => {
      expect(result.description).toEqual(dto.description);
    });

    it('should update new file', async () => {
      result = await service.update(id, dto, file());
      expect(result.image).toEqual(file().filename);
    });
  });

  describe('remove', () => {
    const id = newsStub()._id.toString();
    beforeEach(async () => {
      await repository.deleteMany([id]);
    });
    it('should remove news', () => {
      expect(repository.deleteMany).toHaveBeenCalledWith([id]);
    });
  });
});
