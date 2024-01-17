"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const meter_change_controller_1 = require("../meter-change.controller");
const meter_change_repository_1 = require("../meter-change.repository");
const meter_change_service_1 = require("../meter-change.service");
const meter_change_stub_1 = require("../stubs/meter-change.stub");
const meter_changeDTO_stub_1 = require("../stubs/meter-changeDTO.stub");
const meter_changePopulate_stub_1 = require("../stubs/meter-changePopulate.stub");
const user_stub_1 = require("../stubs/user.stub");
jest.mock('../meter-change.repository');
const user = (0, user_stub_1.userStub)();
describe('MeterChangeService', () => {
    let service;
    let repository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [meter_change_controller_1.MeterChangeController],
            providers: [meter_change_service_1.MeterChangeService, meter_change_repository_1.MeterChangeRepository],
        }).compile();
        service = module.get(meter_change_service_1.MeterChangeService);
        repository = module.get(meter_change_repository_1.MeterChangeRepository);
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
        beforeEach(async () => {
            dto = (0, meter_changeDTO_stub_1.meterChangeDtoStubs)();
            result = await service.create(dto);
        });
        it('should return a meterChange', () => {
            expect(result).toMatchObject(dto);
        });
        it('should return a meterChange with id', () => {
            expect(result._id).toBeDefined();
        });
        it('should call meterChange repository', () => {
            expect(repository.create).toBeCalledWith(dto);
        });
    });
    describe('findAll', () => {
        let result;
        beforeEach(async () => {
            result = await service.findAll(user);
        });
        it('should return meterChanges array', () => {
            expect(result).toEqual([(0, meter_changePopulate_stub_1.meterChangesPopulateStub)()]);
        });
        it('should return array with clientId populate', () => {
            expect(result[0].clientId).toEqual((0, meter_changePopulate_stub_1.meterChangesPopulateStub)().clientId);
        });
        it('should call meterChange repository', () => {
            expect(repository.findAndPopulate).toBeCalledWith({}, [
                'clientId',
                'deviceId',
            ]);
        });
    });
    describe('findOne', () => {
        let result;
        let dto;
        let id;
        beforeEach(async () => {
            dto = (0, meter_changeDTO_stub_1.meterChangeDtoStubs)();
            id = (0, meter_change_stub_1.meterChangeStubs)(dto)._id.toString();
            result = await service.findOne(id);
        });
        it('should return meterChange with correct id', () => {
            expect(result._id).toEqual((0, meter_change_stub_1.meterChangeStubs)(dto)._id);
        });
    });
    describe('update', () => {
        let result;
        let dto;
        const id = '1';
        beforeEach(async () => {
            dto = (0, meter_changeDTO_stub_1.meterChangeDtoStubs)({ firstConsumedNewMeter: 123 });
            result = await service.update(id, dto);
        });
        it('should return meterChange updated', () => {
            expect(result.firstConsumedNewMeter).toEqual(dto.firstConsumedNewMeter);
        });
        it('should call meterChange repository', () => {
            expect(repository.findOneAndUpdate).toBeCalledWith({ _id: id }, dto);
        });
    });
    describe('remove', () => {
        const id = (0, meter_change_stub_1.meterChangeStubs)((0, meter_changeDTO_stub_1.meterChangeDtoStubs)())._id.toString();
        beforeEach(async () => {
            await repository.deleteMany([id]);
        });
        it('should remove meterChange', () => {
            expect(repository.deleteMany).toHaveBeenCalledWith([id]);
        });
    });
});
//# sourceMappingURL=meter-change.service.spec.js.map