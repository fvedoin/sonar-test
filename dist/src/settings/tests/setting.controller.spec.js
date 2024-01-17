"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const setting_controller_1 = require("../setting.controller");
const setting_service_1 = require("../setting.service");
const setting_stub_1 = require("../stubs/setting.stub");
const settingDTO_stub_1 = require("../stubs/settingDTO.stub");
const settingPopulate_stub_1 = require("../stubs/settingPopulate.stub");
const user_stub_1 = require("../stubs/user.stub");
const mongodb_1 = require("mongodb");
jest.mock('../setting.service');
describe('SettingsController', () => {
    let controller;
    let service;
    let findSettings;
    const user = (0, user_stub_1.userStub)();
    beforeEach(async () => {
        findSettings = {
            clientId: new mongodb_1.ObjectId().toHexString(),
            sort: 'asc',
            skip: '0',
            limit: '10',
            searchText: 'textoDeBusca',
            filter: [],
            fieldMask: 'campo1,campo2',
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [setting_controller_1.SettingsController],
            providers: [setting_service_1.SettingsService],
        }).compile();
        controller = module.get(setting_controller_1.SettingsController);
        service = module.get(setting_service_1.SettingsService);
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
            dto = (0, settingDTO_stub_1.settingDtoStubs)();
            result = await controller.create(dto);
        });
        it('should return a setting', () => {
            expect(result).toMatchObject(dto);
        });
        it('should return a setting with id', () => {
            expect(result._id).toBeDefined();
        });
        it('should call setting service', () => {
            expect(service.create).toBeCalledWith(dto);
        });
    });
    describe('findAll', () => {
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, settingDTO_stub_1.settingDtoStubs)();
            result = await service.findAll(findSettings, user);
        });
        it('should return settings array', () => {
            expect(result).toEqual([(0, setting_stub_1.settingStubs)(dto)]);
        });
        it('should call setting service', () => {
            expect(service.findAll).toBeCalled();
        });
    });
    describe('findCriticalAndPrecariousVoltages', () => {
        let result;
        let dto;
        const user = (0, user_stub_1.userStub)();
        const clientId = (0, settingPopulate_stub_1.settingPopulateStub)().clientId.toString();
        beforeEach(async () => {
            dto = (0, settingDTO_stub_1.settingDtoStubs)();
            result = await controller.findCriticalAndPrecariousVoltages(user, clientId);
        });
        it('should return settings array', () => {
            expect(result).toEqual([(0, setting_stub_1.settingStubs)(dto)]);
        });
        it('should call setting service', () => {
            expect(service.findCriticalAndPrecariousVoltages).toBeCalled();
        });
    });
    describe('findOne', () => {
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, settingDTO_stub_1.settingDtoStubs)();
            result = await controller.findOne((0, setting_stub_1.settingStubs)(dto)._id.toString());
        });
        it('should return setting with correct id', () => {
            expect(result._id).toEqual((0, setting_stub_1.settingStubs)(dto)._id);
        });
        it('Should call setting service', () => {
            expect(service.find).toBeCalledWith({
                _id: (0, setting_stub_1.settingStubs)(dto)._id.toString(),
            });
        });
    });
    describe('update', () => {
        let result;
        let dto;
        const id = '1';
        beforeEach(async () => {
            dto = (0, settingDTO_stub_1.settingDtoStubs)({ precariousVoltageAbove: 'updated' });
            result = await controller.update(id, dto);
        });
        it('should return setting updated', () => {
            expect(result.precariousVoltageAbove).toEqual(dto.precariousVoltageAbove);
        });
        it('should call setting service', () => {
            expect(service.update).toBeCalledWith(id, dto);
        });
    });
    describe('remove', () => {
        const id = (0, setting_stub_1.settingStubs)((0, settingDTO_stub_1.settingDtoStubs)())._id.toString();
        beforeEach(async () => {
            await controller.remove(id);
        });
        it('should remove settings', () => {
            expect(service.remove).toHaveBeenCalledWith([id]);
        });
    });
});
//# sourceMappingURL=setting.controller.spec.js.map