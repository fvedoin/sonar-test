"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const last_receiveds_service_1 = require("../last-receiveds.service");
const last_receiveds_repository_1 = require("../last-receiveds.repository");
const lastReceiveds_stubs_1 = require("../stubs/lastReceiveds.stubs");
jest.mock('../last-receiveds.repository');
describe('LastReceivedsService', () => {
    let service;
    let repository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [],
            providers: [last_receiveds_service_1.LastReceivedsService, last_receiveds_repository_1.LastReceivedsRepository],
        }).compile();
        service = module.get(last_receiveds_service_1.LastReceivedsService);
        repository = module.get(last_receiveds_repository_1.LastReceivedsRepository);
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    describe('find', () => {
        let result;
        let query;
        let projection;
        beforeEach(async () => {
            query = {};
            projection = {
                _id: 0,
                __v: 0,
                package: 0,
                receivedAt: 1,
                deviceId: 1,
                port: 1,
            };
            result = await service.find(query, projection);
        });
        it('should be called repository with query and projection', () => {
            expect(repository.find).toBeCalledWith(query, projection);
        });
        it('should return a last received', () => {
            expect(result).toMatchObject([(0, lastReceiveds_stubs_1.lastReceivedsStubs)()]);
        });
    });
});
//# sourceMappingURL=last-receiveds.service.spec.js.map