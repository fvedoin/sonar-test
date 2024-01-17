"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const userDTOStub_1 = require("../../stubs/userDTOStub");
const devices_tr_stub_1 = require("../../stubs/devices-tr.stub");
describe('Devices-tr', () => {
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
        const createUserDto = (0, userDTOStub_1.userDTOStub)();
        await userService.create(createUserDto);
        responseAuthenticate = await request(httpServer).post('/login').send({
            username: createUserDto.username,
            password: createUserDto.password,
        });
        token = `Bearer ${responseAuthenticate.body.access_token}`;
    });
    afterEach(async () => {
        await dbConnection.collection('smarttrafodevices').deleteMany({});
    });
    it(`should be able to return all devices-tr filter devices`, async () => {
        const mockDeviceTrStub = (0, devices_tr_stub_1.deviceTrStub)();
        await dbConnection
            .collection('smarttrafodevices')
            .insertOne(mockDeviceTrStub);
        const response = await request(httpServer)
            .get('/devices-tr/devices')
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it(`should be able to return all devices-tr filter telik trafo lite`, async () => {
        const mockDeviceTrStub = (0, devices_tr_stub_1.deviceTrStub)();
        await dbConnection
            .collection('smarttrafodevices')
            .insertOne(mockDeviceTrStub);
        const response = await request(httpServer)
            .get('/devices-tr/telik-trafo-lite')
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it(`should be able to return all devices-tr filter Transformer telik trafo lite`, async () => {
        const mockDeviceTrStub = (0, devices_tr_stub_1.deviceTrStub)();
        await dbConnection
            .collection('smarttrafodevices')
            .insertOne(mockDeviceTrStub);
        const response = await request(httpServer)
            .get('/devices-tr/filter-telik-trafo-lite')
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it(`should be able to return all devices-tr filter Transformer devices`, async () => {
        const mockDeviceTrStub = (0, devices_tr_stub_1.deviceTrStub)();
        await dbConnection
            .collection('smarttrafodevices')
            .insertOne(mockDeviceTrStub);
        const response = await request(httpServer)
            .get('/devices-tr/filter-devices')
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    describe('Get Device with LastReceiveds', () => {
        it(`should return lastReceiveds devices`, async () => {
            const mockDeviceTrStub = (0, devices_tr_stub_1.deviceTrStub)();
            await dbConnection
                .collection('smarttrafodevices')
                .insertOne(mockDeviceTrStub);
            const response = await request(httpServer)
                .get(`/devices-tr/devices`)
                .set('Authorization', token);
            response.body[0].lastReceiveds.push({
                _id: '6508405e04457769ade251f8',
                deviceId: mockDeviceTrStub._id,
                port: 0,
                __v: 0,
                package: {
                    rssi: -53,
                    type: 'WiFi',
                    ssid: 'Starlink Fox IoT',
                    signal: 94,
                },
                receivedAt: '2023-10-06T12:49:14.208Z',
            });
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[0]).toHaveProperty('lastReceiveds');
            expect(Array.isArray(response.body[0].lastReceiveds)).toBe(true);
            expect(response.body[0].lastReceiveds[0]).toHaveProperty('_id');
            expect(response.body[0].lastReceiveds[0]).toHaveProperty('deviceId');
            expect(response.body[0].lastReceiveds[0]).toHaveProperty('port');
        });
    });
    describe('Get Device with Empty LastReceiveds', () => {
        it(`should return devices with an empty lastReceiveds array`, async () => {
            const mockDeviceTrStub = (0, devices_tr_stub_1.deviceTrStub)();
            await dbConnection
                .collection('smarttrafodevices')
                .insertOne(mockDeviceTrStub);
            const response = await request(httpServer)
                .get(`/devices-tr/devices`)
                .set('Authorization', token);
            expect(response.body[0].lastReceiveds.length).toBe(0);
        });
    });
    describe('Get Analytics', () => {
        it(`should return analytics`, async () => {
            const mockDeviceTrStub = (0, devices_tr_stub_1.deviceTrStub)();
            await dbConnection
                .collection('smarttrafodevices')
                .insertOne(mockDeviceTrStub);
            const response = await request(httpServer)
                .get(`/devices-tr/analytics`)
                .query({
                trsIds: '64de197e761161006887413c',
                dateRange: {
                    startDate: '2023-10-17T03:00:00.000Z',
                    endDate: '2023-10-26T02:59:59.000Z',
                },
                fields: [
                    'apparent_power_phase_a',
                    'apparent_power_phase_b',
                    'apparent_power_phase_c',
                ],
            })
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });
    afterAll(async () => {
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTOStub_1.userDTOStub)().username });
        await app.close();
    });
});
//# sourceMappingURL=devices-tr.e2e-spec.js.map