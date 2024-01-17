"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_emitter_1 = require("@nestjs/event-emitter");
const testing_1 = require("@nestjs/testing");
const setting_controller_1 = require("../setting.controller");
const setting_repository_1 = require("../setting.repository");
const setting_service_1 = require("../setting.service");
const setting_stub_1 = require("../stubs/setting.stub");
const settingDTO_stub_1 = require("../stubs/settingDTO.stub");
const settingPopulate_stub_1 = require("../stubs/settingPopulate.stub");
const user_stub_1 = require("../stubs/user.stub");
const mongodb_1 = require("mongodb");
jest.mock('../setting.repository');
describe('SettingsService', () => {
    let service;
    let repository;
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
            providers: [setting_service_1.SettingsService, setting_repository_1.SettingsRepository, event_emitter_1.EventEmitter2],
        }).compile();
        service = module.get(setting_service_1.SettingsService);
        repository = module.get(setting_repository_1.SettingsRepository);
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('_sanitizeValue', () => {
        it('should remove spaces from string values', () => {
            const dto = {
                precariousVoltageAbove: '1 2 34',
                precariousVoltageBelow: '56 78',
                criticalVoltageAbove: '90 12',
                criticalVoltageBelow: '34 56',
            };
            const result = service.sanitizeValue(dto);
            expect(result.precariousVoltageAbove).toBe('1234');
            expect(result.precariousVoltageBelow).toBe('5678');
            expect(result.criticalVoltageBelow).toBe('3456');
            expect(result.criticalVoltageAbove).toBe('9012');
        });
    });
    describe('create', () => {
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, settingDTO_stub_1.settingDtoStubs)();
            result = await service.create(dto);
        });
        it('should return a Setting', async () => {
            expect(result).toEqual((0, setting_stub_1.settingStubs)(dto));
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
        beforeEach(async () => {
            result = await service.findAll(findSettings, user);
        });
        it('should return settings array', () => {
            const expected = {
                data: [(0, settingPopulate_stub_1.settingPopulateStub)()],
                pageInfo: { count: 1 },
            };
            expect(result).toEqual(expected);
        });
        it('should return array with clientId populate', () => {
            expect(result.data[0].clientId).toEqual((0, settingPopulate_stub_1.settingPopulateStub)().clientId);
        });
        describe('findCriticalAndPrecariousVoltages', () => {
            let result;
            const user = (0, user_stub_1.userStub)();
            const clientId = (0, settingPopulate_stub_1.settingPopulateStub)().clientId.toString();
            beforeEach(async () => {
                result = await service.findCriticalAndPrecariousVoltages(user, clientId);
            });
            it('should return correct extracted settings', () => {
                const expectedSettings = {
                    precariousVoltageAbove: {
                        low: 233,
                        high: 250,
                    },
                    precariousVoltageBelow: {
                        low: 231,
                        high: 233,
                    },
                    criticalVoltageAbove: {
                        low: 231,
                        high: 233,
                    },
                    criticalVoltageBelow: {
                        low: 191,
                        high: 202,
                    },
                };
                expect(result).toEqual(expectedSettings);
            });
            it('should call setting repository', () => {
                expect(repository.findOne).toBeCalledWith({ clientId: clientId }, {
                    precariousVoltageAbove: 1,
                    precariousVoltageBelow: 1,
                    criticalVoltageAbove: 1,
                    criticalVoltageBelow: 1,
                });
            });
        });
        describe('findOne', () => {
            let result;
            let dto;
            let id;
            beforeEach(async () => {
                dto = (0, settingDTO_stub_1.settingDtoStubs)();
                id = (0, setting_stub_1.settingStubs)(dto)._id.toString();
                result = await service.find({ _id: id });
            });
            it('should return setting with correct id', () => {
                expect(result._id).toEqual((0, setting_stub_1.settingStubs)(dto)._id);
            });
            it('Should call setting repository', () => {
                expect(repository.findOne).toBeCalledWith({ _id: id }, undefined);
            });
        });
    });
    describe('update', () => {
        let result;
        let dto;
        const id = '1';
        beforeEach(async () => {
            dto = (0, settingDTO_stub_1.settingDtoStubs)({ precariousVoltageAbove: 'updated' });
            result = await service.update(id, dto);
        });
        it('should return setting updated', () => {
            expect(result.precariousVoltageAbove).toEqual(dto.precariousVoltageAbove);
        });
        it('should call setting repository', () => {
            expect(repository.findOneAndUpdate).toBeCalledWith({ _id: id }, { $set: dto });
        });
    });
    describe('remove', () => {
        let dto;
        beforeEach(async () => {
            dto = (0, settingDTO_stub_1.settingDtoStubs)();
            await service.remove([(0, setting_stub_1.settingStubs)(dto)._id.toString()]);
        });
        it('Should call setting repository', () => {
            expect(repository.deleteMany).toBeCalledWith({
                _id: { $in: [(0, setting_stub_1.settingStubs)(dto)._id.toString()] },
            });
        });
    });
});
//# sourceMappingURL=setting.service.spec.js.map