"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const area_controller_1 = require("../area.controller");
const area_service_1 = require("../area.service");
const area_stub_1 = require("../stubs/area.stub");
const areaDTO_stub_1 = require("../stubs/areaDTO.stub");
const user_stub_1 = require("../stubs/user.stub");
jest.mock('../area.service');
const user = (0, user_stub_1.userStub)();
describe('AreaController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [area_controller_1.AreaController],
            providers: [area_service_1.AreaService],
        }).compile();
        controller = module.get(area_controller_1.AreaController);
        service = module.get(area_service_1.AreaService);
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
        let parsedPoints = [];
        beforeEach(async () => {
            dto = (0, areaDTO_stub_1.areaDtoStubs)();
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
            expect(service.create).toBeCalledWith({ ...dto, points: parsedPoints }, user);
        });
    });
    describe('findAll', () => {
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, areaDTO_stub_1.areaDtoStubs)();
            result = await controller.findAll(user);
        });
        it('should return areas array', () => {
            expect(result).toEqual([(0, area_stub_1.areaStubs)(dto)]);
        });
        it('should call area service', () => {
            expect(service.findAll).toBeCalled();
        });
    });
    describe('findOne', () => {
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, areaDTO_stub_1.areaDtoStubs)();
            result = await controller.findOne((0, area_stub_1.areaStubs)(dto)._id.toString());
        });
        it('should return area with correct id', () => {
            expect(result._id).toEqual((0, area_stub_1.areaStubs)(dto)._id);
        });
        it('Should call area service', () => {
            expect(service.findOne).toBeCalledWith((0, area_stub_1.areaStubs)(dto)._id.toString());
        });
    });
    describe('update', () => {
        let result;
        let dto;
        const id = '1';
        beforeEach(async () => {
            dto = (0, areaDTO_stub_1.areaDtoStubs)({ name: 'updated' });
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
        let dto;
        beforeEach(async () => {
            dto = (0, areaDTO_stub_1.areaDtoStubs)();
            await controller.remove((0, area_stub_1.areaStubs)(dto)._id.toString());
        });
        it('Should call area service', () => {
            expect(service.remove).toBeCalledWith([(0, area_stub_1.areaStubs)(dto)._id.toString()]);
        });
    });
});
//# sourceMappingURL=area.controller.spec.js.map