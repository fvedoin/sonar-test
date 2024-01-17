"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const dashboard_controller_1 = require("../dashboard.controller");
const dashboard_service_1 = require("../dashboard.service");
jest.mock('../dashboard.service');
describe('DashboardController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [dashboard_controller_1.DashboardController],
            providers: [dashboard_service_1.DashboardService],
        }).compile();
        controller = module.get(dashboard_controller_1.DashboardController);
        service = module.get(dashboard_service_1.DashboardService);
        jest.clearAllMocks();
    });
    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('lastHour', () => {
        let result;
        let clientId;
        beforeEach(async () => {
            clientId = '123';
            result = await controller.lastHour(clientId);
        });
        it('should return a dashboard', () => {
            expect(result[0].lastHour).toBeDefined();
            expect(result[0].status).toBeDefined();
            expect(result[0].ucCode).toBeDefined();
        });
        it('should call dashboard service', () => {
            expect(service.lastHour).toBeCalledWith(clientId);
        });
    });
});
//# sourceMappingURL=dashboard.controller.spec.js.map