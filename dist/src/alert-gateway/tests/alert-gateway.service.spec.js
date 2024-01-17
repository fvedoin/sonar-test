"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const alert_gateway_service_1 = require("../alert-gateway.service");
const alert_gateway_repository_1 = require("../alert-gateway.repository");
const alertGatewayDTO_stub_1 = require("../stubs/alertGatewayDTO.stub");
const alertGateway_stub_1 = require("../stubs/alertGateway.stub");
jest.mock('../alert-gateway.repository');
describe('AlertGatewayService', () => {
    let service;
    let repository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [alert_gateway_service_1.AlertGatewayService, alert_gateway_repository_1.AlertGatewayRepository],
        }).compile();
        service = module.get(alert_gateway_service_1.AlertGatewayService);
        repository = module.get(alert_gateway_repository_1.AlertGatewayRepository);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    describe('remove', () => {
        let dto;
        beforeEach(async () => {
            dto = (0, alertGatewayDTO_stub_1.alertGatewayDtoStubs)();
            await service.remove([(0, alertGateway_stub_1.alertGatewayStubs)(dto)._id.toString()]);
        });
        it('Should call alertGateway remove repository', () => {
            expect(repository.deleteMany).toBeCalledWith({
                _id: { $in: [(0, alertGateway_stub_1.alertGatewayStubs)(dto)._id.toString()] },
            });
        });
    });
});
//# sourceMappingURL=alert-gateway.service.spec.js.map