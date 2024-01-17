"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ucdisabled_history_controller_1 = require("../ucdisabled-history.controller");
const ucdisabled_history_service_1 = require("../ucdisabled-history.service");
const ucdisabled_history_stub_1 = require("../stubs/ucdisabled-history.stub");
jest.mock('../ucdisabled-history.service');
describe('UcdisabledHistoryController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [ucdisabled_history_controller_1.UcdisabledHistoryController],
            providers: [ucdisabled_history_service_1.UcdisabledHistoryService],
        }).compile();
        controller = module.get(ucdisabled_history_controller_1.UcdisabledHistoryController);
        service = module.get(ucdisabled_history_service_1.UcdisabledHistoryService);
        jest.clearAllMocks();
    });
    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('UcdisabledHistory', () => {
        let result;
        let dto;
        let query;
        beforeEach(async () => {
            dto = (0, ucdisabled_history_stub_1.createUcdisabledHistoryDtoStubs)();
            result = await controller.findAll(query);
        });
        it('should return UcdisabledHistory array', () => {
            const expectedData = [(0, ucdisabled_history_stub_1.createUcdisabledHistoryDtoStubs)(dto)];
            const expected = { data: expectedData, pageInfo: {} };
            expect(result).toEqual(expected);
        });
        it('should call UcdisabledHistory service', () => {
            expect(service.findAll).toBeCalled();
        });
    });
    describe('create', () => {
        let result;
        let dto;
        let session;
        beforeEach(async () => {
            dto = (0, ucdisabled_history_stub_1.createUcdisabledHistoryDtoStubs)();
            result = await controller.create(dto, session);
        });
        it('should return a ucdisabledHistory', () => {
            expect(result).toMatchObject(dto);
        });
    });
});
//# sourceMappingURL=ucdisabled-history.controller.spec.js.map