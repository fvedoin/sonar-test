"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("mongoose");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const userDTOStub_1 = require("../../../devices-gb/stubs/userDTOStub");
const ucdisabled_history_stub_1 = require("../../stubs/ucdisabled-history.stub");
describe('ucdisabled-history', () => {
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
        const createUserDto = (0, userDTOStub_1.userDTOStub)();
        await userService.create(createUserDto);
        responseAuthenticate = await request(httpServer).post('/login').send({
            username: createUserDto.username,
            password: createUserDto.password,
        });
        token = `Bearer ${responseAuthenticate.body.access_token}`;
    });
    beforeAll(async () => {
        await dbConnection.collection('ucdisabledhistories').deleteMany({});
    });
    it(`should be able to return all ucdisabled-history`, async () => {
        const mockUcDisabledHistoryStub = (0, ucdisabled_history_stub_1.createUcdisabledHistoryDtoStubs)();
        await dbConnection
            .collection('ucdisabledhistories')
            .insertOne(mockUcDisabledHistoryStub);
        const response = await request(httpServer)
            .get('/ucdisabled-history')
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    it(`should return 401 when not authenticated`, async () => {
        const response = await request(httpServer).get('/ucdisabled-history');
        expect(response.status).toBe(401);
    });
    describe(`should be able to return UcDisabledHistory using filtering`, () => {
        const UcsDisabledHistory = [];
        beforeAll(async () => {
            UcsDisabledHistory.push({
                dataDeleted: true,
                user: 'User Example',
                ucCode: '122',
                devId: '123',
                date: new Date('2023-08-30T14:00:00Z'),
                clientId,
                _id: new mongoose_1.Types.ObjectId(),
            });
            UcsDisabledHistory.push({
                dataDeleted: true,
                user: 'User Another Example',
                ucCode: '123',
                devId: '124',
                date: new Date('2023-08-31T15:00:00Z'),
                clientId: 'AnotherClientId',
                _id: new mongoose_1.Types.ObjectId(),
            });
            await dbConnection
                .collection('ucdisabledhistories')
                .insertMany(UcsDisabledHistory);
        });
        it(`should be able to return all ucDisabledHistory filtered by 'clientId'`, async () => {
            const response = await request(httpServer)
                .get(`/ucdisabled-history?skip=0&limit=10&clientId=${clientId.toString()}&fieldMask[clientId]=1,fieldMask[it]=1&fieldMask[feeder]=1&fieldMask[city]=1`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return 2 ucDisabledhistory filtered by ucCode 123 `, async () => {
            const response = await request(httpServer)
                .get(`/ucdisabled-history?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][ucCode][0]=${UcsDisabledHistory[1].ucCode}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
        });
        it(`should be able to return 1 ucDisabledhistory filtered by devId 124 `, async () => {
            const response = await request(httpServer)
                .get(`/ucdisabled-history?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][devId][0]=${UcsDisabledHistory[1].devId}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
        });
        it(`should be able to return 1 ucDisabledhistory filtered by date`, async () => {
            const response = await request(httpServer)
                .get(`/ucdisabled-history?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][dateRange][startDate][0]=${UcsDisabledHistory[1].date}&filter[0][dateRange][endDate]=2023-11-16T03:15:59.000Z`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const ucdisabledHistory of response.body.data) {
                expect(new Date(ucdisabledHistory.date)).toEqual(UcsDisabledHistory[1].date);
            }
        });
        it(`should be able to return 3 ucDisabledhistory filtered by date.endDate`, async () => {
            const response = await request(httpServer)
                .get(`/ucdisabled-history?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][dateRange][endDate]=2023-11-16T03:15:59.000Z`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return 1 ucDisabledhistory filtered by date.startDate`, async () => {
            const response = await request(httpServer)
                .get(`/ucdisabled-history?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][dateRange][startDate][0]=${UcsDisabledHistory[1].date}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
        });
        it(`should be able to return 1 ucDisabledhistory filtered by user`, async () => {
            const response = await request(httpServer)
                .get(`/ucdisabled-history?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][user][0]=${UcsDisabledHistory[1].user}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const ucdisabledHistory of response.body.data) {
                expect(ucdisabledHistory.user).toEqual(UcsDisabledHistory[1].user);
            }
        });
        it(`should be able to return 1 ucDisabledhistory filtered by user`, async () => {
            const response = await request(httpServer)
                .get(`/ucdisabled-history?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][user][0]=${UcsDisabledHistory[1].user}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const ucdisabledHistory of response.body.data) {
                expect(ucdisabledHistory.user).toEqual(UcsDisabledHistory[1].user);
            }
        });
        it(`should be able to return all 3 UcDisabledHistory for sort (devId) descending`, async () => {
            const response = await request(httpServer)
                .get(`/ucdisabled-history?skip=0&limit=10&sort[devId]=-1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return all 3 UcDisabledHistory for sort (devId) growing`, async () => {
            const response = await request(httpServer)
                .get(`/ucdisabled-history?skip=0&limit=10&sort[devId]=1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return all 3 UcDisabledHistory for sort (ucCode) descending`, async () => {
            const response = await request(httpServer)
                .get(`/ucdisabled-history?skip=0&limit=10&sort[ucCode]=-1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return all 3 UcDisabledHistory for sort (ucCode) growing`, async () => {
            const response = await request(httpServer)
                .get(`/ucdisabled-history?skip=0&limit=10&sort[ucCode]=1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
    });
    afterAll(async () => {
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTOStub_1.userDTOStub)().username });
        await dbConnection.collection('ucdisabledhistories').deleteMany({});
        await app.close();
    });
});
//# sourceMappingURL=ucdisabled-history.e2e-spec.js.map