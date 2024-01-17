"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("mongoose");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
const clientDTO_stub_1 = require("../../stubs/clientDTO.stub");
describe('AlertsHistory', () => {
    let app;
    let dbConnection;
    let httpServer;
    let userService;
    let responseAuthenticate;
    let token;
    const clientId = new mongoose_1.Types.ObjectId();
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
    it(`should be able to return all AlertHistory`, async () => {
        await dbConnection.collection('alerthistories');
        const response = await request(httpServer)
            .get('/alertsHistory')
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    describe(`should be able to return alertHistory using filtering`, () => {
        const alertHistory = [];
        const mockClientStub = (0, clientDTO_stub_1.clientStub)(clientId);
        beforeAll(async () => {
            alertHistory.push({
                alertType: 'UC',
                alertName: '111',
                alertAllows: 'Custom Allows',
                alertVariables: 'current_phase_a',
                alertValue: '0',
                operator: '>',
                sentEmail: ['brunoalvestavares@foxiot.com'],
                alertTime: new Date('2023-08-30T14:00:00Z'),
                clientId: mockClientStub._id,
                _id: new mongoose_1.Types.ObjectId(),
            });
            alertHistory.push({
                alertType: 'TR',
                alertName: '222',
                alertAllows: 'Custom Allows',
                alertVariables: 'current_phase_a',
                alertValue: '0',
                operator: '>',
                sentEmail: ['brunoalvestavares@foxiot.com'],
                alertTime: new Date('2023-08-30T14:00:00Z'),
                clientId: mockClientStub._id,
                _id: new mongoose_1.Types.ObjectId(),
            });
            await dbConnection.collection('alerthistories').insertMany(alertHistory);
            await dbConnection.collection('clients').insertOne(mockClientStub);
        });
        it(`should be able to return all alertHistory filtered by 'clientId'`, async () => {
            const response = await request(httpServer)
                .get(`/alertsHistory?skip=0&limit=10&clientId=${clientId.toString()}&fieldMask[clientId]=1,fieldMask[alertType]=1&fieldMask[alertName]=1&fieldMask[alertAllows]=1`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
        });
        it(`should be able to return 1 alertHistory filtered by alertType`, async () => {
            const response = await request(httpServer)
                .get(`/alertsHistory?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][alertType][0]=${alertHistory[1].alertType}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const alertsHistory of response.body.data) {
                expect(alertsHistory.alertType).toEqual(alertHistory[1].alertType);
            }
        });
        it(`should be able to return all (2) alertHistory filtered by 'dateRange.startDate' using filter`, async () => {
            const response = await request(httpServer)
                .get(`/alertsHistory?skip=0&limit=10&sort[name]=1&searchText=&filter[0][dateRange][startDate]=2023-08-10T15:00:00.000Z`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            for (const alertHistory of response.body.data) {
                expect(alertHistory.clientId.name).toEqual(mockClientStub.name);
            }
        });
        it(`should be able to return all (2) alertHistory filtered by 'dateRange.endDate' using filter`, async () => {
            const response = await request(httpServer)
                .get(`/alertsHistory?skip=0&limit=10&sort[name]=1&searchText=&filter[0][dateRange][endDate]=2023-11-30T03:59:59.000Z`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            for (const transformer of response.body.data) {
                expect(transformer.clientId.name).toEqual(mockClientStub.name);
            }
        });
        it(`should be able to return 1 alertHistory filtered by alertName and alertValue`, async () => {
            const response = await request(httpServer)
                .get(`/alertsHistory?skip=0&limit=10&sort[name]=1&searchText=&filter[0][alertName][0]=${alertHistory[0].alertName}&filter[1][alertValue][0]=${alertHistory[1].alertValue}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const alertsHistory of response.body.data) {
                expect(alertsHistory.alertName).toEqual(alertHistory[0].alertName);
            }
        });
        it(`should be able to return 2 alertHistory filtered by alertVariables`, async () => {
            const response = await request(httpServer)
                .get(`/alertsHistory?skip=0&limit=10&sort[name]=1&searchText=&filter[0][alertVariables][0]=${alertHistory[0].alertVariables}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
        });
        it(`should be able to return all 3 alertHistory for sort (sentEmail) growing`, async () => {
            const response = await request(httpServer)
                .get(`/alertsHistory?skip=0&limit=10&sort[sentEmail]=1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
        });
        it(`should be able to return all 2 alertHistory for sort (alertType) descending`, async () => {
            const response = await request(httpServer)
                .get(`/alertsHistory?skip=0&limit=10&sort[alertType]=-1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
        });
        it(`should be able to return all 3 alertHistory for sort (alertType) growing`, async () => {
            const response = await request(httpServer)
                .get(`/alertsHistory?skip=0&limit=10&sort[alertType]=1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
        });
        it(`should be able to return 2 alertHistory filtered by sentEmail`, async () => {
            const response = await request(httpServer)
                .get(`/alertsHistory?skip=0&limit=10&sort[name]=1&searchText=&filter[0][sentEmail][0]=${alertHistory[1].sentEmail}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            for (const alertsHistory of response.body.data) {
                expect(alertsHistory.sentEmail).toEqual(alertHistory[1].sentEmail);
            }
        });
        it(`should be able to return 1 alertHistory filtered by alertType and operator`, async () => {
            const response = await request(httpServer)
                .get(`/alertsHistory?skip=0&limit=10&sort[name]=1&searchText=&filter[0][alertType][0]=${alertHistory[0].alertType}&filter[1][operator][0]=${alertHistory[0].operator}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
        });
    });
    afterAll(async () => {
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
        await dbConnection.collection('alerthistories').deleteMany({});
        await app.close();
    });
});
//# sourceMappingURL=alerts-history.e2e-spec.js.map