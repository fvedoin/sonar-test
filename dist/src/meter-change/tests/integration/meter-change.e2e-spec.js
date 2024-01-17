"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("mongoose");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
const users_service_1 = require("../../../users/users.service");
const meter_change_stub_1 = require("../../stubs/meter-change.stub");
const meter_changeDTO_stub_1 = require("../../stubs/meter-changeDTO.stub");
const client_stub_1 = require("../../stubs/client.stub");
const deviceGB_stub_1 = require("../../stubs/deviceGB.stub");
describe('MeterChange', () => {
    let app;
    let dbConnection;
    let httpServer;
    let userService;
    let responseAuthenticate;
    let token;
    const clientId = new mongoose_1.Types.ObjectId().toString();
    const deviceId = new mongoose_1.Types.ObjectId().toString();
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
        await dbConnection.collection('meterchanges').deleteMany({});
        await dbConnection
            .collection('devices')
            .deleteOne({ _id: new mongoose_1.Types.ObjectId(deviceId) });
        await dbConnection
            .collection('clients')
            .deleteOne({ _id: new mongoose_1.Types.ObjectId(clientId) });
    });
    it(`should be able to return all meterChange`, async () => {
        const mockDevice = (0, deviceGB_stub_1.deviceGBStub)(deviceId);
        const mockClient = (0, client_stub_1.clientStub)(clientId);
        const mockMeterChangeStub = (0, meter_change_stub_1.meterChangeStubs)((0, meter_changeDTO_stub_1.meterChangeDtoStubs)({ clientId, deviceId }));
        await dbConnection
            .collection('meterchanges')
            .insertOne(mockMeterChangeStub);
        await dbConnection.collection('clients').insertOne(mockClient);
        await dbConnection.collection('devices').insertOne(mockDevice);
        const response = await request(httpServer)
            .get('/meter-changes')
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(response.body[0].clientId).toMatchObject(mockClient);
        expect(response.body[0].deviceId).toMatchObject(mockDevice);
        expect(response.body[0]._id).toMatch(mockMeterChangeStub._id.toString());
    });
    it(`should be able to return a meterChange by id`, async () => {
        const mockMeterChangeStub = (0, meter_change_stub_1.meterChangeStubs)((0, meter_changeDTO_stub_1.meterChangeDtoStubs)());
        await dbConnection
            .collection('meterchanges')
            .insertOne(mockMeterChangeStub);
        const response = await request(httpServer)
            .get(`/meter-changes/${mockMeterChangeStub._id.toString()}`)
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(response.body._id.toString()).toEqual(mockMeterChangeStub._id.toString());
    });
    it('should be able to create a meterChange', async () => {
        const mockMeterChangeStub = (0, meter_changeDTO_stub_1.meterChangeDtoStubs)();
        const response = await request(httpServer)
            .post(`/meter-changes`)
            .send(mockMeterChangeStub)
            .set('Authorization', token);
        expect(response.status).toBe(201);
        expect(response.body._id).toBeDefined();
    });
    it('should be able to update a meterChange', async () => {
        const mockMeterChangeStub = (0, meter_change_stub_1.meterChangeStubs)((0, meter_changeDTO_stub_1.meterChangeDtoStubs)());
        const mockMeterChangeStubUpdate = (0, meter_changeDTO_stub_1.meterChangeDtoStubs)({
            firstConsumedNewMeter: 123,
        });
        await dbConnection
            .collection('meterchanges')
            .insertOne(mockMeterChangeStub);
        const response = await request(httpServer)
            .put(`/meter-changes/${mockMeterChangeStub._id}`)
            .send(mockMeterChangeStubUpdate)
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(response.body.firstConsumedNewMeter).toEqual(mockMeterChangeStubUpdate.firstConsumedNewMeter);
    });
    it('should be able to delete a meterChange', async () => {
        const mockMeterChangeStub = (0, meter_change_stub_1.meterChangeStubs)((0, meter_changeDTO_stub_1.meterChangeDtoStubs)());
        await dbConnection
            .collection('meterchanges')
            .insertOne(mockMeterChangeStub);
        const response = await request(httpServer)
            .delete(`/meter-changes/${mockMeterChangeStub._id}`)
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    afterAll(async () => {
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
        await app.close();
    });
});
//# sourceMappingURL=meter-change.e2e-spec.js.map