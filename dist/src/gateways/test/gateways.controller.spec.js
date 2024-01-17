"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const gateways_controller_1 = require("../gateways.controller");
const gateways_service_1 = require("../gateways.service");
const gateway_stub_1 = require("../stubs/gateway.stub");
const user_stub_1 = require("../stubs/user.stub");
const gatewayFindOne_stub_1 = require("../stubs/gatewayFindOne.stub");
const gatewayFilteredClient_stub_1 = require("../stubs/gatewayFilteredClient.stub");
const gatewayLink_stub_1 = require("../stubs/gatewayLink.stub");
jest.mock('../gateways.service');
const user = (0, user_stub_1.userStub)();
describe('GatewaysController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [gateways_controller_1.GatewaysController],
            providers: [gateways_service_1.GatewaysService],
        }).compile();
        controller = module.get(gateways_controller_1.GatewaysController);
        service = module.get(gateways_service_1.GatewaysService);
        jest.clearAllMocks();
    });
    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('findAll', () => {
        let result;
        beforeEach(async () => {
            result = await controller.findAll(user);
        });
        it('should return gateways array', () => {
            expect(result).toEqual([gateway_stub_1.gatewayResponseStub]);
        });
        it('should call gateway service', () => {
            expect(service.findAll).toBeCalled();
        });
    });
    describe('findOne', () => {
        let result;
        let ttnId;
        beforeEach(async () => {
            ttnId = 'poiuytrewq';
            result = await controller.findOne(ttnId);
        });
        it('should return expected object', () => {
            expect(result).toEqual(gatewayFindOne_stub_1.findOneResponseStub);
        });
        it('should call gateway service', () => {
            expect(service.findOne).toBeCalledWith(ttnId);
        });
    });
    describe('filterByClients', () => {
        let result;
        let user;
        let clientId;
        beforeEach(async () => {
            user = (0, user_stub_1.userStub)();
            clientId = '1';
            result = await controller.filterByClients(user, clientId);
        });
        it('should return expected array of objects', () => {
            expect(result).toEqual(gatewayFilteredClient_stub_1.findFilteredGatewaysResponseStub);
        });
        it('should call gateway service', () => {
            expect(service.filterByClients).toBeCalledWith(user, clientId);
        });
    });
    describe('update', () => {
        let result;
        let ttnId;
        let linkGatewayDto;
        beforeEach(async () => {
            ttnId = 'poiuytrewq';
            linkGatewayDto = gatewayLink_stub_1.linkGatewayDtoStub;
            result = await controller.update(ttnId, linkGatewayDto);
        });
        it('should return expected result', () => {
            expect(result).toEqual(gatewayFindOne_stub_1.findOneResponseStub);
        });
        it('should call gatewaysService.link', () => {
            expect(service.link).toBeCalledWith(ttnId, linkGatewayDto);
        });
    });
});
//# sourceMappingURL=gateways.controller.spec.js.map