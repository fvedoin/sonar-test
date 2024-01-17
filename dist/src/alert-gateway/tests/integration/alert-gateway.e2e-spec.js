"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
const alertGateway_stub_1 = require("../../stubs/alertGateway.stub");
const alertGatewayDTO_stub_1 = require("../../stubs/alertGatewayDTO.stub");
describe('AlertGateway', () => {
    let app;
    let dbConnection;
    let httpServer;
    let userService;
    let responseAuthenticate;
    let token;
    beforeAll(async () => {
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
    it('should be able to delete a alertGateway', async () => {
        const mockAlertGatewayStub = (0, alertGateway_stub_1.alertGatewayStubs)((0, alertGatewayDTO_stub_1.alertGatewayDtoStubs)());
        await dbConnection
            .collection('alertgateways')
            .insertOne(mockAlertGatewayStub);
        const response = await request(httpServer)
            .delete(`/alert-gateway/${mockAlertGatewayStub._id}`)
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    it('should return 400 when trying to delete a non-existent alertGateway', async () => {
        const nonExistentAlertGatewayId = 'nonexistentalertGatewayid';
        const response = await request(httpServer)
            .delete(`/alert-gateway/${nonExistentAlertGatewayId}`)
            .set('Authorization', token);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Não foi possível deletar os alertas de gateways!');
    });
    it('should return 401 when trying to delete without authentication', async () => {
        const mockAlertGatewayStub = (0, alertGateway_stub_1.alertGatewayStubs)((0, alertGatewayDTO_stub_1.alertGatewayDtoStubs)());
        await dbConnection
            .collection('alertgateways')
            .insertOne(mockAlertGatewayStub);
        const response = await request(httpServer).delete(`/alert-gateway/${mockAlertGatewayStub._id}`);
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized');
    });
    afterAll(async () => {
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
        await dbConnection.collection('alertgateways').deleteMany({});
        await app.close();
    });
});
//# sourceMappingURL=alert-gateway.e2e-spec.js.map