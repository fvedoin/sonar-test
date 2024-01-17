"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_stub_1 = require("../stubs/user.stub");
const meter_change_controller_1 = require("../meter-change.controller");
const meter_change_service_1 = require("../meter-change.service");
const meter_change_stub_1 = require("../stubs/meter-change.stub");
const meter_changeDTO_stub_1 = require("../stubs/meter-changeDTO.stub");
jest.mock('../meter-change.service');
const user = (0, user_stub_1.userStub)();
describe('MeterChangeController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [meter_change_controller_1.MeterChangeController],
            providers: [meter_change_service_1.MeterChangeService],
        }).compile();
        controller = module.get(meter_change_controller_1.MeterChangeController);
        service = module.get(meter_change_service_1.MeterChangeService);
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
            dto = (0, meter_changeDTO_stub_1.meterChangeDtoStubs)();
            result = await controller.create(dto);
        });
        it('should return a meterChange', () => {
            expect(result).toMatchObject(dto);
        });
        it('should return a meterChange with id', () => {
            expect(result._id).toBeDefined();
        });
        it('should call meterChange service', () => {
            expect(service.create).toBeCalledWith(dto);
        });
    });
    describe('findAll', () => {
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, meter_changeDTO_stub_1.meterChangeDtoStubs)();
            result = await controller.findAll(user);
        });
        it('should return meterChange array', () => {
            expect(result).toEqual([(0, meter_change_stub_1.meterChangeStubs)(dto)]);
        });
        it('should call meterChange service', () => {
            expect(service.findAll).toBeCalled();
        });
    });
    describe('findOne', () => {
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, meter_changeDTO_stub_1.meterChangeDtoStubs)();
            result = await controller.findOne((0, meter_change_stub_1.meterChangeStubs)(dto)._id.toString());
        });
        it('should return meterChange with correct id', () => {
            expect(result._id).toEqual((0, meter_change_stub_1.meterChangeStubs)(dto)._id);
        });
        it('Should call meterChange service', () => {
            expect(service.findOne).toBeCalledWith((0, meter_change_stub_1.meterChangeStubs)(dto)._id.toString());
        });
    });
    describe('update', () => {
        let result;
        let dto;
        const id = '1';
        beforeEach(async () => {
            dto = (0, meter_changeDTO_stub_1.meterChangeDtoStubs)({ firstConsumedNewMeter: 123 });
            result = await controller.update(id, dto);
        });
        it('should return meterChange updated', () => {
            expect(result.firstConsumedNewMeter).toEqual(dto.firstConsumedNewMeter);
        });
        it('should call meterChange service', () => {
            expect(service.update).toBeCalledWith(id, dto);
        });
    });
    describe('remove', () => {
        const id = (0, meter_change_stub_1.meterChangeStubs)((0, meter_changeDTO_stub_1.meterChangeDtoStubs)())._id.toString();
        beforeEach(async () => {
            await controller.remove(id);
        });
        it('should remove meterChange', () => {
            expect(service.remove).toHaveBeenCalledWith([id]);
        });
    });
});
//# sourceMappingURL=meter-change.controller.spec.js.map