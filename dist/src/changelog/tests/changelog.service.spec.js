"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const changelog_controller_1 = require("../changelog.controller");
const changelog_repository_1 = require("../changelog.repository");
const changelog_service_1 = require("../changelog.service");
const changelog_stub_1 = require("../stubs/changelog.stub");
const changelogDTO_stub_1 = require("../stubs/changelogDTO.stub");
const updateChangelogDTO_stub_1 = require("../stubs/updateChangelogDTO.stub");
jest.mock('../changelog.repository');
describe('ChangelogsService', () => {
    let service;
    let repository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [changelog_controller_1.ChangelogsController],
            providers: [changelog_service_1.ChangelogsService, changelog_repository_1.ChangelogsRepository],
        }).compile();
        service = module.get(changelog_service_1.ChangelogsService);
        repository = module.get(changelog_repository_1.ChangelogsRepository);
        jest.clearAllMocks();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    describe('create', () => {
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, changelogDTO_stub_1.createChangelogDto)();
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
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, changelogDTO_stub_1.createChangelogDto)();
            result = await service.findAll();
        });
        it('should return changelogs array', () => {
            expect(result).toEqual([(0, changelog_stub_1.createChangeLogWithId)(dto)]);
        });
        it('Should call changelogs repository', () => {
            expect(repository.find).toBeCalled();
        });
    });
    describe('findOne', () => {
        let result;
        let dto;
        let id;
        beforeEach(async () => {
            dto = (0, changelogDTO_stub_1.createChangelogDto)();
            id = (0, changelog_stub_1.createChangeLogWithId)(dto)._id.toString();
            result = await service.findOne(id);
        });
        it('should return changelog with correct id', () => {
            expect(result).toEqual((0, changelog_stub_1.createChangeLogWithId)(dto));
        });
        it('Should call changelogs repository', () => {
            expect(repository.findOne).toBeCalledWith({ _id: id });
        });
    });
    describe('update', () => {
        let result;
        let dto;
        const id = '1';
        beforeEach(async () => {
            dto = (0, updateChangelogDTO_stub_1.updateChangelogDto)({ description: 'updated' });
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
        let dto;
        let id;
        beforeEach(async () => {
            dto = (0, changelogDTO_stub_1.createChangelogDto)();
            id = (0, changelog_stub_1.createChangeLogWithId)(dto)._id.toString();
            await service.remove(id);
        });
        it('Should call changelogs repository', () => {
            expect(repository.delete).toBeCalledWith(id);
        });
    });
});
//# sourceMappingURL=changelog.service.spec.js.map