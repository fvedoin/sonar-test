"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const alert_gateway_controller_1 = require("../alert-gateway.controller");
const alert_gateway_service_1 = require("../alert-gateway.service");
const alertGatewayDTO_stub_1 = require("../stubs/alertGatewayDTO.stub");
const alertGateway_stub_1 = require("../stubs/alertGateway.stub");
jest.mock('../alert-gateway.service');
describe('AlertGatewayController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [alert_gateway_controller_1.AlertGatewayController],
            providers: [alert_gateway_service_1.AlertGatewayService],
        }).compile();
        controller = module.get(alert_gateway_controller_1.AlertGatewayController);
        service = module.get(alert_gateway_service_1.AlertGatewayService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('remove', () => {
        let dto;
        beforeEach(async () => {
            dto = (0, alertGatewayDTO_stub_1.alertGatewayDtoStubs)();
            await controller.remove((0, alertGateway_stub_1.alertGatewayStubs)(dto)._id.toString());
        });
        it('Should call alertGateway remove service', () => {
            expect(service.remove).toBeCalledWith([
                (0, alertGateway_stub_1.alertGatewayStubs)(dto)._id.toString(),
            ]);
        });
    });
});
//# sourceMappingURL=alert-gateway.controller.spec.js.map