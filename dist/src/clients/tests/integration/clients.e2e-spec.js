"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const client_stub_1 = require("../../stubs/client.stub");
const clientDTO_stub_1 = require("../../stubs/clientDTO.stub");
const users_service_1 = require("../../../users/users.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
describe('Client', () => {
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
    afterEach(async () => {
        await dbConnection.collection('clients').deleteMany({});
    });
    it('should be able to create a client', async () => {
        const mockClientStub = (0, clientDTO_stub_1.clientDtoStubs)();
        const response = await request(httpServer)
            .post(`/clients`)
            .send(mockClientStub)
            .set('Authorization', token);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject((0, client_stub_1.clientStubs)(mockClientStub));
    });
    afterAll(async () => {
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
        await app.close();
    });
});
//# sourceMappingURL=clients.e2e-spec.js.map