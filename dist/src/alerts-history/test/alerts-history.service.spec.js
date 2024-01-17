"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const alerts_history_controller_1 = require("../alerts-history.controller");
const alerts_history_service_1 = require("../alerts-history.service");
const alerts_history_repository_1 = require("../alerts-history.repository");
const alertsHistoryPopulate_stub_1 = require("../stubs/alertsHistoryPopulate.stub");
const user_stub_1 = require("../stubs/user.stub");
const mongodb_1 = require("mongodb");
jest.mock('../alerts-history.repository');
const user = (0, user_stub_1.userStub)();
describe('AlertsHistoryService', () => {
    let service;
    let repository;
    let findAlerts;
    beforeEach(async () => {
        findAlerts = {
            clientId: new mongodb_1.ObjectId().toHexString(),
            sort: 'asc',
            skip: '0',
            limit: '10',
            searchText: 'textoDeBusca',
            filter: [],
            fieldMask: 'campo1,campo2',
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [alerts_history_controller_1.AlertsHistoryController],
            providers: [alerts_history_service_1.AlertsHistoryService, alerts_history_repository_1.AlertsHistoryRepository],
        }).compile();
        service = module.get(alerts_history_service_1.AlertsHistoryService);
        repository = module.get(alerts_history_repository_1.AlertsHistoryRepository);
        jest.clearAllMocks();
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('getAlertsHistory', () => {
        let result;
        beforeEach(async () => {
            result = await service.findAll(findAlerts, user);
        });
        it('should return alertsHistory array', () => {
            const expected = {
                data: [(0, alertsHistoryPopulate_stub_1.alertHistoryPopulateStub)()],
                pageInfo: { count: 1 },
            };
            expect(result).toEqual(expected);
        });
        it('should return array with clientId populate', () => {
            expect(result.data[0].clientId).toEqual((0, alertsHistoryPopulate_stub_1.alertHistoryPopulateStub)().clientId);
        });
    });
});
//# sourceMappingURL=alerts-history.service.spec.js.map