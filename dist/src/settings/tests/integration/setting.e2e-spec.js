"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("mongoose");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
const setting_stub_1 = require("../../stubs/setting.stub");
const settingDTO_stub_1 = require("../../stubs/settingDTO.stub");
const clientDTO_stub_1 = require("../../stubs/clientDTO.stub");
describe('Settings', () => {
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
    it(`should be able to return all settings`, async () => {
        const mockSettingStub = (0, setting_stub_1.settingStubs)((0, settingDTO_stub_1.settingDtoStubs)());
        await dbConnection.collection('settings').insertOne(mockSettingStub);
        const response = await request(httpServer)
            .get('/settings')
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    describe(`should be able to return Settings using filtering`, () => {
        const settings = [];
        const mockSettingsStub = (0, settingDTO_stub_1.settingDtoStubs)();
        const mockClientStub = (0, clientDTO_stub_1.clientStub)(mockSettingsStub.clientId);
        beforeAll(async () => {
            settings.push({
                offlineTime: 5,
                peakHourStart: 21,
                peakHourEnd: 0,
                precariousVoltageAbove: '234,250',
                precariousVoltageBelow: '235,233',
                criticalVoltageAbove: '236,233',
                criticalVoltageBelow: '190,202',
                clientId,
                _id: new mongoose_1.Types.ObjectId(),
            });
            settings.push({
                offlineTime: 10,
                peakHourStart: 33,
                peakHourEnd: 0,
                precariousVoltageAbove: '234,250',
                precariousVoltageBelow: '235,233',
                criticalVoltageAbove: '236,233',
                criticalVoltageBelow: '190,202',
                clientId,
                _id: new mongoose_1.Types.ObjectId(),
            });
            await dbConnection.collection('settings').insertMany(settings);
            await dbConnection.collection('clients').insertOne(mockClientStub);
            await dbConnection.collection('clients').insertOne({
                name: '0000',
                address: 'Testing Address',
                cnpj: '11111',
                initials: '1111',
                local: '111',
                modules: ['test'],
                _id: clientId,
            });
        });
        it(`should be able to return all settings filtered by 'clientId'`, async () => {
            const response = await request(httpServer)
                .get(`/settings?skip=0&limit=10&clientId=${clientId.toString()}&fieldMask[clientId]=1`)
                .set('Authorization', token);
            console.log(response.body.data);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
        });
        it(`should be able to return settings filtered by (1) for offlineTime `, async () => {
            const response = await request(httpServer)
                .get(`/settings?skip=0&limit=10&sort[offlineTime]=1&searchText=&filter[0][offlineTime][0]=${mockSettingsStub.offlineTime}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const setting of response.body.data) {
                expect(setting.offlineTime).toEqual(mockSettingsStub.offlineTime);
            }
        });
        it(`should be able to return 2 settings filtered by peakHourStart`, async () => {
            const response = await request(httpServer)
                .get(`/settings?skip=0&limit=10&sort[offlineTime]=1&searchText=&filter[0][peakHourStart][0]=${settings[0].peakHourStart}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
        });
        it(`should be able to return 1 settings filtered by peakHourEnd`, async () => {
            const response = await request(httpServer)
                .get(`/settings?skip=0&limit=10&sort[offlineTime]=1&searchText=&filter[0][peakHourEnd][0]=${settings[1].peakHourEnd}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return 1 setting filtered by offlineTime for peakHourStart`, async () => {
            const response = await request(httpServer)
                .get(`/settings?skip=0&limit=10&sort[offlineTime]=1&searchText=&filter[0][offlineTime][0]=${settings[0].offlineTime}&filter[1][peakHourStart][0]=${mockSettingsStub.peakHourStart}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const setting of response.body.data) {
                expect(setting.offlineTime).toEqual(settings[0].offlineTime);
            }
        });
        it(`should be able to return all 2 settings for sort (offlineTime) descending`, async () => {
            const response = await request(httpServer)
                .get(`/settings?skip=0&limit=10&sort[offlineTime]=-1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return all 2 settings for sort (offlineTime) growing`, async () => {
            const response = await request(httpServer)
                .get(`/settings?skip=0&limit=10&sort[offlineTime]=1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return all 2 settings for sort (peakHourEnd) descending`, async () => {
            const response = await request(httpServer)
                .get(`/settings?skip=0&limit=10&sort[peakHourEnd]=-1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return all 2 settings for sort (peakHourEnd) growing`, async () => {
            const response = await request(httpServer)
                .get(`/settings?skip=0&limit=10&sort[peakHourEnd]=1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
    });
    it(`should be able to return a setting by id`, async () => {
        const mockSettingStub = (0, setting_stub_1.settingStubs)((0, settingDTO_stub_1.settingDtoStubs)());
        const response = await request(httpServer)
            .get(`/settings/${mockSettingStub._id}`)
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(mockSettingStub);
    });
    it('should be able to create a setting', async () => {
        const mockSettingStub = (0, settingDTO_stub_1.settingDtoStubs)();
        const response = await request(httpServer)
            .post(`/settings`)
            .send(mockSettingStub)
            .set('Authorization', token);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject((0, setting_stub_1.settingStubs)(mockSettingStub));
    });
    it('should be able to update a setting', async () => {
        const mockSettingStub = (0, setting_stub_1.settingStubs)((0, settingDTO_stub_1.settingDtoStubs)());
        const mockSettingStubUpdate = (0, settingDTO_stub_1.settingDtoStubs)({
            precariousVoltageAbove: 'Updatedsetting',
        });
        const response = await request(httpServer)
            .put(`/settings/${mockSettingStub._id}`)
            .send(mockSettingStubUpdate)
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(response.body.precariousVoltageAbove).toEqual(mockSettingStubUpdate.precariousVoltageAbove);
    });
    it('should be able to delete a setting', async () => {
        const mockSettingStub = (0, setting_stub_1.settingStubs)((0, settingDTO_stub_1.settingDtoStubs)());
        const response = await request(httpServer)
            .delete(`/settings/${mockSettingStub._id}`)
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    afterAll(async () => {
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
        await dbConnection.collection('settings').deleteMany({});
        await dbConnection.collection('clients').deleteMany({});
        await app.close();
    });
});
//# sourceMappingURL=setting.e2e-spec.js.map