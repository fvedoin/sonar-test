"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const news_controller_1 = require("../news.controller");
const news_service_1 = require("../news.service");
const file_stub_1 = require("../stubs/file.stub");
const news_stub_1 = require("../stubs/news.stub");
const updateNewsDTO_stub_1 = require("../stubs/updateNewsDTO.stub");
jest.mock('../news.service');
describe('NewsController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [news_controller_1.NewsController],
            providers: [news_service_1.NewsService],
        }).compile();
        controller = module.get(news_controller_1.NewsController);
        service = module.get(news_service_1.NewsService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
    describe('create', () => {
        let result;
        beforeEach(async () => {
            result = await controller.create((0, news_stub_1.newsStub)(), (0, file_stub_1.file)());
        });
        it('should create news', () => {
            expect(result).toMatchObject((0, news_stub_1.newsStub)());
        });
        it('should return a news with id', () => {
            expect(result._id).toBeDefined();
        });
        it('Should call news service', () => {
            expect(service.create).toBeCalledWith((0, news_stub_1.newsStub)(), (0, file_stub_1.file)());
        });
    });
    describe('findAll', () => {
        let result;
        beforeEach(async () => {
            result = await controller.findAll();
        });
        it('should return news array', async () => {
            expect(result).toEqual([(0, news_stub_1.newsStub)()]);
        });
        it('Should call news service', () => {
            expect(service.findAll).toBeCalled();
        });
    });
    describe('findOne', () => {
        let result;
        beforeEach(async () => {
            result = await controller.findOne((0, news_stub_1.newsStub)()._id.toString());
        });
        it('should return news with correct id', () => {
            expect(result._id).toEqual((0, news_stub_1.newsStub)()._id);
        });
        it('Should call news service', () => {
            expect(service.findOne).toBeCalledWith((0, news_stub_1.newsStub)()._id.toString());
        });
    });
    describe('update', () => {
        let result;
        let dto;
        const id = '1';
        beforeEach(async () => {
            dto = (0, updateNewsDTO_stub_1.updateNewsDto)({ description: 'updated' });
        });
        it('should return news updated', async () => {
            result = await controller.update(id, dto, null);
            expect(result.description).toEqual(dto.description);
        });
        it('should update new file', async () => {
            result = await controller.update(id, dto, (0, file_stub_1.file)());
            expect(result.description).toEqual(dto.description);
        });
    });
    describe('remove', () => {
        const id = (0, news_stub_1.newsStub)()._id.toString();
        beforeEach(async () => {
            await controller.remove(id);
        });
        it('should remove news', () => {
            expect(service.remove).toHaveBeenCalledWith([id]);
        });
    });
});
//# sourceMappingURL=news.controller.spec.js.map