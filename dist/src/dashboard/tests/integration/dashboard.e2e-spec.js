"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("mongoose");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
const uc_stub_1 = require("../../stubs/uc.stub");
const device_stub_1 = require("../../stubs/device.stub");
const settings_stub_1 = require("../../stubs/settings.stub");
const lastReceived_stub_1 = require("../../stubs/lastReceived.stub");
describe('Dashboard', () => {
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
    const clientId = new mongoose_1.Types.ObjectId();
    it('lastHour', async () => {
        await dbConnection
            .collection('lastReceiveds')
            .insertOne((0, lastReceived_stub_1.lastReceivedStub)((0, device_stub_1.devicesStub)(clientId)._id));
        await dbConnection.collection('settings').insertOne((0, settings_stub_1.settingsStub)(clientId));
        await dbConnection.collection('ucs').insertOne((0, uc_stub_1.ucStub)(clientId));
        const response = await request(httpServer)
            .get(`/dashboard/${clientId}`)
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(response.body.notifications).toBeDefined();
        expect(response.body.ucs).toBeDefined();
    });
    afterAll(async () => {
        await dbConnection.collection('clients').deleteOne({ _id: clientId });
        await dbConnection.collection('ucs').deleteOne({ clientId });
        await dbConnection.collection('devices').deleteOne({ clientId });
        await dbConnection.collection('settings').deleteOne({ clientId });
        await dbConnection
            .collection('lastReceiveds')
            .deleteOne({ deviceId: (0, device_stub_1.devicesStub)(clientId)._id });
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
        await app.close();
    });
});
//# sourceMappingURL=dashboard.e2e-spec.js.map