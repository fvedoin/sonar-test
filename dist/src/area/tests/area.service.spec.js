"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const area_controller_1 = require("../area.controller");
const area_service_1 = require("../area.service");
const area_stub_1 = require("../stubs/area.stub");
const areaDTO_stub_1 = require("../stubs/areaDTO.stub");
const user_stub_1 = require("../stubs/user.stub");
const area_repository_1 = require("../area.repository");
const areaPopulate_stub_1 = require("../stubs/areaPopulate.stub");
jest.mock('../area.repository');
const user = (0, user_stub_1.userStub)();
describe('AreaService', () => {
    let service;
    let repository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [area_controller_1.AreaController],
            providers: [area_service_1.AreaService, area_repository_1.AreaRepository],
        }).compile();
        service = module.get(area_service_1.AreaService);
        repository = module.get(area_repository_1.AreaRepository);
        jest.clearAllMocks();
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        let result;
        let dto;
        let parsedPoints = [];
        beforeEach(async () => {
            dto = (0, areaDTO_stub_1.areaDtoStubs)();
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
        let result;
        let dto;
        let parsedPoints = [];
        beforeEach(async () => {
            dto = (0, areaDTO_stub_1.areaDtoStubs)();
            parsedPoints = dto.points.map(({ lng, lat }) => ({
                type: 'Point',
                coordinates: [lng, lat],
            }));
            try {
                result = await service.create({ ...dto, clientId: null, points: parsedPoints }, user);
            }
            catch (error) {
                result = error.message;
            }
        });
        it('should get error', () => {
            expect(result).toBe('ClientId é obrigatório');
        });
    });
    describe('findAll', () => {
        let result;
        beforeEach(async () => {
            result = await service.findAll(user);
        });
        it('should return areas array', () => {
            expect(result).toEqual([(0, areaPopulate_stub_1.areaPopulateStub)()]);
        });
        it('should return array with clientId populate', () => {
            expect(result[0].clientId).toEqual((0, areaPopulate_stub_1.areaPopulateStub)().clientId);
        });
        it('should call area repository', () => {
            expect(repository.findAllAndPopulate).toBeCalledWith(['clientId']);
        });
    });
    describe('findOne', () => {
        let result;
        let dto;
        let id;
        beforeEach(async () => {
            dto = (0, areaDTO_stub_1.areaDtoStubs)();
            id = (0, area_stub_1.areaStubs)(dto)._id.toString();
            result = await service.findOne(id);
        });
        it('should return area with correct id', () => {
            expect(result._id).toEqual((0, area_stub_1.areaStubs)(dto)._id);
        });
        it('Should call area repository', () => {
            expect(repository.findOne).toBeCalledWith({ _id: id });
        });
    });
    describe('update', () => {
        let result;
        let dto;
        const id = '1';
        let parsedPoints = [];
        beforeEach(async () => {
            dto = (0, areaDTO_stub_1.areaDtoStubs)({ name: 'updated' });
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
            expect(repository.findOneAndUpdate).toBeCalledWith({ _id: id }, { ...dto, points: parsedPoints });
        });
    });
    describe('remove', () => {
        let dto;
        beforeEach(async () => {
            dto = (0, areaDTO_stub_1.areaDtoStubs)();
            await service.remove([(0, area_stub_1.areaStubs)(dto)._id.toString()]);
        });
        it('Should call area repository', () => {
            expect(repository.deleteMany).toBeCalledWith({
                _id: { $in: [(0, area_stub_1.areaStubs)(dto)._id.toString()] },
            });
        });
    });
});
//# sourceMappingURL=area.service.spec.js.map