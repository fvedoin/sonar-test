"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const changelog_controller_1 = require("../changelog.controller");
const changelog_service_1 = require("../changelog.service");
const changelog_stub_1 = require("../stubs/changelog.stub");
const changelogDTO_stub_1 = require("../stubs/changelogDTO.stub");
const updateChangelogDTO_stub_1 = require("../stubs/updateChangelogDTO.stub");
jest.mock('../changelog.service');
describe('ChangelogsController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [changelog_controller_1.ChangelogsController],
            providers: [changelog_service_1.ChangelogsService],
        }).compile();
        controller = module.get(changelog_controller_1.ChangelogsController);
        service = module.get(changelog_service_1.ChangelogsService);
        jest.clearAllMocks();
    });
    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, changelogDTO_stub_1.createChangelogDto)();
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
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, changelogDTO_stub_1.createChangelogDto)();
            result = await controller.findAll();
        });
        it('should return changelogs array', () => {
            expect(result).toEqual([(0, changelog_stub_1.createChangeLogWithId)(dto)]);
        });
        it('Should call changelogs service', () => {
            expect(service.findAll).toBeCalled();
        });
    });
    describe('findOne', () => {
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, changelogDTO_stub_1.createChangelogDto)();
            result = await controller.findOne((0, changelog_stub_1.createChangeLogWithId)(dto)._id.toString());
        });
        it('should return changelog with correct id', () => {
            expect(result).toEqual((0, changelog_stub_1.createChangeLogWithId)(dto));
        });
        it('Should call changelogs service', () => {
            expect(service.findOne).toBeCalledWith((0, changelog_stub_1.createChangeLogWithId)(dto)._id.toString());
        });
    });
    describe('update', () => {
        let result;
        let dto;
        const id = '1';
        beforeEach(async () => {
            dto = (0, updateChangelogDTO_stub_1.updateChangelogDto)({ description: 'updated' });
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
        let id;
        beforeEach(async () => {
            const dto = (0, changelogDTO_stub_1.createChangelogDto)();
            id = (0, changelog_stub_1.createChangeLogWithId)(dto)._id.toString();
            await controller.remove(id);
        });
        it('Should call remove service with id', () => {
            expect(service.remove).toBeCalledWith(id);
        });
    });
});
//# sourceMappingURL=changelog.controller.spec.js.map