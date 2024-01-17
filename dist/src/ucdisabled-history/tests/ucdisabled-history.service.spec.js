"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ucdisabled_history_service_1 = require("../ucdisabled-history.service");
const ucdisabled_history_repository_1 = require("../ucdisabled-history.repository");
const ucdisabled_history_controller_1 = require("../ucdisabled-history.controller");
const ucdisabled_history_stub_1 = require("../stubs/ucdisabled-history.stub");
jest.mock('../ucdisabled-history.repository');
describe('UcdisabledHistoryService', () => {
    let service;
    let repository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [ucdisabled_history_controller_1.UcdisabledHistoryController],
            providers: [ucdisabled_history_service_1.UcdisabledHistoryService, ucdisabled_history_repository_1.UcdisabledHistoryRepository],
        }).compile();
        service = module.get(ucdisabled_history_service_1.UcdisabledHistoryService);
        repository = module.get(ucdisabled_history_repository_1.UcdisabledHistoryRepository);
        jest.clearAllMocks();
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('findAll', () => {
        it('should be defined', () => {
            expect(service.findAll).toBeDefined();
        });
    });
    describe('create', () => {
        let result;
        let dto;
        let session;
        beforeEach(async () => {
            dto = (0, ucdisabled_history_stub_1.createUcdisabledHistoryDtoStubs)();
            result = await service.create(dto, session);
        });
        it('should return a ucdisabledHistory', () => {
            expect(result).toMatchObject(dto);
        });
    });
});
//# sourceMappingURL=ucdisabled-history.service.spec.js.map