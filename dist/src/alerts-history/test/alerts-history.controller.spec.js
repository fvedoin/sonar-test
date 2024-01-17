"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const alerts_history_controller_1 = require("../alerts-history.controller");
const alerts_history_service_1 = require("../alerts-history.service");
const alertsHistoryDTO_stub_1 = require("../stubs/alertsHistoryDTO.stub");
const user_stub_1 = require("../stubs/user.stub");
jest.mock('../alerts-history.service');
const user = (0, user_stub_1.userStub)();
describe('AlertsHistoryController', () => {
    let controller;
    let service;
    let findAlerts;
    beforeEach(async () => {
        findAlerts = {
            clientId: new Object().toString(),
            sort: 'asc',
            skip: '0',
            limit: '10',
            searchText: 'textoDeBusca',
            filter: [],
            fieldMask: 'campo1,campo2',
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [alerts_history_controller_1.AlertsHistoryController],
            providers: [alerts_history_service_1.AlertsHistoryService],
        }).compile();
        controller = module.get(alerts_history_controller_1.AlertsHistoryController);
        service = module.get(alerts_history_service_1.AlertsHistoryService);
        jest.clearAllMocks();
    });
    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('getAlertsHistory', () => {
        let result;
        let dto;
        const expected = {
            data: [
                {
                    alertAllows: 'Custom Allows',
                    alertName: '111',
                    alertTime: new Date('2023-08-30T14:00:00.000Z'),
                    alertType: 'UC',
                    alertValue: '0',
                    alertVariables: 'IA - Corrente na fase A (A)',
                    clientId: '123123123123sad121231',
                    operator: '>',
                    sentEmail: ['brunoalvestavares@foxiot.com'],
                },
            ],
            pageInfo: {
                count: 1,
            },
        };
        beforeEach(async () => {
            dto = (0, alertsHistoryDTO_stub_1.alertsHistoryDtoStubs)();
            result = await service.findAll(findAlerts, user);
        });
        it('should return alertsHistory array', () => {
            expect(result).toEqual(expected);
        });
        it('should call alertsHistory service', () => {
            expect(service.findAll).toBeCalled();
        });
    });
});
//# sourceMappingURL=alerts-history.controller.spec.js.map