"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_stub_1 = require("../stubs/user.stub");
const gateways_service_1 = require("../gateways.service");
const gateways_repository_1 = require("../gateways.repository");
const gateways_controller_1 = require("../gateways.controller");
const gateway_stub_1 = require("../stubs/gateway.stub");
const axios_mock_adapter_1 = require("axios-mock-adapter");
const ttn_service_1 = require("../../common/services/ttn.service");
const gatewayFindOne_stub_1 = require("../stubs/gatewayFindOne.stub");
const gatewayFilteredClient_stub_1 = require("../stubs/gatewayFilteredClient.stub");
const gatewayLink_stub_1 = require("../stubs/gatewayLink.stub");
jest.mock('../gateways.repository');
const user = (0, user_stub_1.userStub)();
describe('GatewaysService', () => {
    let service;
    let repository;
    let axiosMock;
    beforeEach(async () => {
        axiosMock = new axios_mock_adapter_1.default(ttn_service_1.TtnService);
        const module = await testing_1.Test.createTestingModule({
            controllers: [gateways_controller_1.GatewaysController],
            providers: [gateways_service_1.GatewaysService, gateways_repository_1.GatewaysRepository],
        }).compile();
        service = module.get(gateways_service_1.GatewaysService);
        repository = module.get(gateways_repository_1.GatewaysRepository);
        jest.clearAllMocks();
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('findAll', () => {
        let result;
        beforeEach(async () => {
            axiosMock
                .onGet('gs/gateways/gateway_id/connection/stats')
                .reply(200, { data: { last_status_received_at: '2023-09-04' } });
            axiosMock
                .onGet('gateways?field_mask=name,description,frequency_plan_ids,gateway_server_address')
                .reply(200, { gateways: [gateway_stub_1.gatewayResponseStub] });
            result = await service.findAll(user);
        });
        it('should return gateways array', () => {
            expect(result).toEqual([gateway_stub_1.gatewayResponseStub]);
        });
    });
    describe('findOne', () => {
        let result;
        let ttnId;
        beforeEach(async () => {
            ttnId = 'poiuytrewq';
            axiosMock
                .onGet(`gateways/${ttnId}?field_mask=name,description`)
                .reply(200, { name: 'bjnkml', description: 'GatewayDescription' });
            result = await service.findOneWhere({ ttnId });
        });
        it('should return expected object', () => {
            expect(result).toEqual(gatewayFindOne_stub_1.findOneResponseStub);
        });
    });
    describe('filterByClients', () => {
        let result;
        let user;
        let clientId;
        beforeEach(async () => {
            user = (0, user_stub_1.userStub)();
            clientId = '1';
            axiosMock
                .onGet('gateways?field_mask=name,description')
                .reply(200, { gateways: gatewayFilteredClient_stub_1.findFilteredGatewaysResponseStub });
            result = await service.filterByClients(user, clientId);
        });
        it('should return expected array of objects', () => {
            expect(result).toEqual(gatewayFilteredClient_stub_1.findFilteredGatewaysResponseStub);
        });
    });
    describe('update', () => {
        let result;
        let ttnId;
        let linkGatewayDto;
        beforeEach(async () => {
            ttnId = 'poiuytrewq';
            linkGatewayDto = gatewayLink_stub_1.linkGatewayDtoStub;
            result = await service.link(ttnId, linkGatewayDto);
        });
        it('should return expected result', () => {
            expect(result).toEqual(gatewayFindOne_stub_1.findOneResponseStub);
        });
    });
});
//# sourceMappingURL=gateways.service.spec.js.map