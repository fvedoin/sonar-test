"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
const gateway_stub_1 = require("../../stubs/gateway.stub");
const gatewayFindOne_stub_1 = require("../../stubs/gatewayFindOne.stub");
const axios_mock_adapter_1 = require("axios-mock-adapter");
const ttn_service_1 = require("../../../common/services/ttn.service");
const gatewayFilteredClient_stub_1 = require("../../stubs/gatewayFilteredClient.stub");
describe('Gateways', () => {
    let app;
    let dbConnection;
    let httpServer;
    let userService;
    let responseAuthenticate;
    let token;
    let axiosMock;
    beforeAll(async () => {
        axiosMock = new axios_mock_adapter_1.default(ttn_service_1.TtnService);
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        dbConnection = moduleRef
            .get(database_service_1.DatabaseService)
            .getDbHandle();
        userService = moduleRef.get(users_service_1.UsersService);
        httpServer = app.getHttpServer();
        const createUserDto = (0, userDTO_stub_1.userDTOStub)();
        await userService.create(createUserDto);
        responseAuthenticate = await request(httpServer).post('/login').send({
            username: createUserDto.username,
            password: createUserDto.password,
        });
        token = `Bearer ${responseAuthenticate.body.access_token}`;
    });
    afterEach(async () => {
        await dbConnection.collection('gateways').deleteMany({});
    });
    it(`should be able to return all gateways`, async () => {
        const mockGatewayStub = gateway_stub_1.gatewayResponseStub;
        await dbConnection.collection('gateways').insertOne(mockGatewayStub);
        axiosMock
            .onGet('gs/gateways/gateway_id/connection/stats')
            .reply(200, { data: { last_status_received_at: '2023-09-04' } });
        axiosMock
            .onGet('gateways?field_mask=name,description,frequency_plan_ids,gateway_server_address')
            .reply(200, { gateways: [gateway_stub_1.gatewayResponseStub] });
        const response = await request(httpServer)
            .get('/gateways')
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    it(`should be able to return a gateways by id`, async () => {
        const mockGatewayStub = gatewayFindOne_stub_1.findOneResponseStub;
        await dbConnection.collection('gateways').insertOne(mockGatewayStub);
        const ttnId = 'poiuytrewq';
        axiosMock
            .onGet(`gateways/${ttnId}?field_mask=name,description`)
            .reply(200, { name: 'bjnkml', description: 'GatewayDescription' });
        const response = await request(httpServer)
            .get(`/gateways/ttn/${ttnId}`)
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    it(`should be able to return a gateways for clientId`, async () => {
        const mockGatewayStub = gatewayFindOne_stub_1.findOneResponseStub;
        await dbConnection.collection('gateways').insertOne(mockGatewayStub);
        axiosMock
            .onGet('gateways?field_mask=name,description')
            .reply(200, { gateways: gatewayFilteredClient_stub_1.findFilteredGatewaysResponseStub });
        const clientId = '64de077bd89e32004e59fb37';
        const response = await request(httpServer)
            .get(`/gateways/filterByClients?clientId=${clientId}`)
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    it('should be able to update a gateway', async () => {
        const mockGatewayStub = gatewayFindOne_stub_1.findOneResponseStub;
        const mockGatewayStubUpdate = {
            ...mockGatewayStub,
            clientId: ['64de077bd89e32004e59fb37'],
        };
        await dbConnection.collection('gateways').insertOne(mockGatewayStub);
        const response = await request(httpServer)
            .post(`/gateways/${mockGatewayStub.ttnId}/link`)
            .send(mockGatewayStubUpdate)
            .set('Authorization', token);
        expect(response.status).toBe(201);
        expect(response.body.clientId).toEqual(mockGatewayStubUpdate.clientId);
    });
    it('should return an error when updating a gateway with invalid clientId', async () => {
        const mockGatewayStub = gatewayFindOne_stub_1.findOneResponseStub;
        const mockGatewayStubUpdate = {
            ...mockGatewayStub,
            clientId: 33333,
        };
        await dbConnection.collection('gateways').insertOne(mockGatewayStub);
        const response = await request(httpServer)
            .post(`/gateways/${mockGatewayStub.ttnId}/link`)
            .send(mockGatewayStubUpdate)
            .set('Authorization', token);
        expect(response.status).toBe(500);
        expect(response.body.message).toEqual('Ocorreu um erro ao atualizar o gateway.');
    });
    afterAll(async () => {
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
        await app.close();
    });
});
//# sourceMappingURL=gateways.e2e-spec.js.map