"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ucs_controller_1 = require("../ucs.controller");
const ucs_service_1 = require("../ucs.service");
const ucDto_stub_1 = require("../stubs/ucDto.stub");
const currentUser_stub_1 = require("../stubs/currentUser.stub");
const uc_stub_1 = require("../stubs/uc.stub");
const mongoose_1 = require("@nestjs/mongoose");
const Role_1 = require("../../auth/models/Role");
jest.mock('../ucs.service');
describe('UcsController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [ucs_controller_1.UcsController],
            providers: [
                ucs_service_1.UcsService,
                {
                    provide: (0, mongoose_1.getConnectionToken)('Database'),
                    useValue: {},
                },
            ],
        }).compile();
        controller = module.get(ucs_controller_1.UcsController);
        service = module.get(ucs_service_1.UcsService);
        jest.clearAllMocks();
    });
    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe(`User - ${Role_1.Role.SUPER_ADMIN}`, () => {
        describe('create', () => {
            let result;
            let dto;
            let currentUser;
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)();
                currentUser = (0, currentUser_stub_1.currentUserStub)();
                result = await controller.create(dto, currentUser);
            });
            it('should return a uc', () => {
                expect(result).toMatchObject((0, uc_stub_1.ucStubs)(dto));
            });
            it('should return a uc with id', () => {
                expect(result._id).toBeDefined();
            });
            it('should call uc service', () => {
                expect(service.create).toBeCalledWith(dto, currentUser);
            });
        });
        describe('findAllPaginated', () => {
            let result;
            let dto;
            let currentUser;
            let query;
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)();
                currentUser = (0, currentUser_stub_1.currentUserStub)();
                result = await controller.findAllPaginated(query, currentUser);
            });
            it('should return ucs array', () => {
                expect(result).toMatchObject({ data: [(0, uc_stub_1.ucStubs)(dto)], pageInfo: {} });
            });
            it('should call uc service', () => {
                expect(service.findPaginated).toBeCalledWith(currentUser, query);
            });
        });
        describe('findAll', () => {
            let result;
            let dto;
            let currentUser;
            let query;
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)();
                currentUser = (0, currentUser_stub_1.currentUserStub)();
                result = await controller.findAll(query, currentUser);
            });
            it('should return ucs array', () => {
                expect(result).toMatchObject([(0, uc_stub_1.ucStubs)(dto)]);
            });
            it('should call uc service', () => {
                expect(service.findAll).toBeCalledWith(currentUser, query);
            });
        });
        describe('findOne', () => {
            let result;
            let dto;
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)();
                result = await controller.findOne((0, uc_stub_1.ucStubs)(dto)._id.toString());
            });
            it('should return uc with correct id', () => {
                expect(result._id).toEqual((0, uc_stub_1.ucStubs)(dto)._id);
            });
            it('Should call uc service', () => {
                expect(service.findByIdPopulate).toBeCalledWith((0, uc_stub_1.ucStubs)(dto)._id.toString());
            });
        });
        describe('update', () => {
            let result;
            let dto;
            let currentUser;
            const id = '1';
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)({ ucCode: '123' });
                currentUser = (0, currentUser_stub_1.currentUserStub)();
                result = await controller.update(id, dto, currentUser);
            });
            it('should return uc updated', () => {
                expect(result.ucCode).toEqual(dto.ucCode);
            });
            it('should call uc service', () => {
                expect(service.update).toBeCalledWith(id, dto, currentUser);
            });
        });
        describe('removeOne', () => {
            let dto;
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)();
                await controller.remove((0, uc_stub_1.ucStubs)(dto)._id.toString());
            });
            it('Should call uc service', () => {
                expect(service.removeOne).toBeCalledWith((0, uc_stub_1.ucStubs)(dto)._id.toString());
            });
        });
        describe('removeMany', () => {
            let dto;
            beforeEach(async () => {
                dto = (0, ucDto_stub_1.ucDtoStubs)();
                await controller.removeMany((0, uc_stub_1.ucStubs)(dto)._id.toString());
            });
            it('Should call uc service', () => {
                expect(service.removeMany).toBeCalledWith([
                    (0, uc_stub_1.ucStubs)(dto)._id.toString(),
                ]);
            });
        });
    });
});
//# sourceMappingURL=ucs.controller.spec.js.map