"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const news_service_1 = require("../news.service");
const news_controller_1 = require("../news.controller");
const news_repository_1 = require("../news.repository");
const news_stub_1 = require("../stubs/news.stub");
const file_stub_1 = require("../stubs/file.stub");
const updateNewsDTO_stub_1 = require("../stubs/updateNewsDTO.stub");
const aws_s3_manager_service_1 = require("../../aws-s3-manager/aws-s3-manager.service");
jest.mock('../news.repository');
jest.mock('fs/promises');
describe('ChangelogsService', () => {
    let service;
    let repository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [news_controller_1.NewsController],
            providers: [
                news_service_1.NewsService,
                news_repository_1.NewsRepository,
                {
                    provide: aws_s3_manager_service_1.AwsS3ManagerService,
                    useValue: {
                        uploadFile: jest.fn(),
                    },
                },
            ],
        }).compile();
        service = module.get(news_service_1.NewsService);
        repository = module.get(news_repository_1.NewsRepository);
        jest.clearAllMocks();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
        expect(repository).toBeDefined();
    });
    describe('create', () => {
        let result;
        beforeEach(async () => {
            result = await service.create((0, news_stub_1.newsStub)(), (0, file_stub_1.file)());
        });
        it('should create news', () => {
            expect(result).toMatchObject((0, news_stub_1.newsStub)());
        });
        it('should return a news with id', () => {
            expect(result._id).toBeDefined();
        });
        it('Should call news service', () => {
            const pattern = `^news/\\d{13}-${(0, file_stub_1.file)().originalname.replace(/\./, '\\.')}$`;
            const regex = new RegExp(pattern);
            const newsDto = {
                ...(0, news_stub_1.newsStub)(),
                image: expect.stringMatching(regex),
            };
            expect(repository.create).toBeCalledWith(newsDto);
        });
    });
    describe('findAll', () => {
        let result;
        beforeEach(async () => {
            result = await service.findAll();
        });
        it('should return news array', async () => {
            expect(result).toEqual([(0, news_stub_1.newsStub)()]);
        });
        it('Should call news service', () => {
            expect(repository.find).toBeCalled();
        });
    });
    describe('findOne', () => {
        let result;
        beforeEach(async () => {
            result = await service.findOne((0, news_stub_1.newsStub)()._id.toString());
        });
        it('should return news with correct id', () => {
            expect(result._id).toEqual((0, news_stub_1.newsStub)()._id);
        });
        it('Should call news service', () => {
            expect(repository.findOne).toBeCalledWith({
                _id: (0, news_stub_1.newsStub)()._id.toString(),
            });
        });
    });
    describe('update', () => {
        let result;
        let dto;
        const id = '1';
        beforeEach(async () => {
            dto = (0, updateNewsDTO_stub_1.updateNewsDto)({ description: 'updated' });
            result = await service.update(id, dto, null);
        });
        it('should return news updated', async () => {
            expect(result.description).toEqual(dto.description);
        });
        it('should update new file', async () => {
            result = await service.update(id, dto, (0, file_stub_1.file)());
            expect(result.image).toEqual((0, file_stub_1.file)().filename);
        });
    });
    describe('remove', () => {
        const id = (0, news_stub_1.newsStub)()._id.toString();
        beforeEach(async () => {
            await repository.deleteMany([id]);
        });
        it('should remove news', () => {
            expect(repository.deleteMany).toHaveBeenCalledWith([id]);
        });
    });
});
//# sourceMappingURL=news.service.spec.js.map