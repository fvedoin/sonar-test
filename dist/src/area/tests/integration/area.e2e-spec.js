"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("mongoose");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const area_stub_1 = require("../../stubs/area.stub");
const areaDTO_stub_1 = require("../../stubs/areaDTO.stub");
const users_service_1 = require("../../../users/users.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
describe('Area', () => {
    let app;
    let dbConnection;
    let httpServer;
    let userService;
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
    });
    describe('Access with access level Role.SUPER_ADMIN', () => {
        let response;
        let adminToken;
        const createUserDto = (0, userDTO_stub_1.userDTOStub)();
        beforeAll(async () => {
            await userService.create(createUserDto);
            response = await request(httpServer).post('/login').send({
                username: createUserDto.username,
                password: createUserDto.password,
            });
            adminToken = `Bearer ${response.body.access_token}`;
        });
        afterEach(async () => {
            await dbConnection.collection('areas').deleteMany({});
        });
        it(`should be able to return all areas`, async () => {
            const mockAreaStub = (0, area_stub_1.areaStubs)((0, areaDTO_stub_1.areaDtoStubs)());
            await dbConnection.collection('areas').insertMany([
                mockAreaStub,
                {
                    ...mockAreaStub,
                    _id: new mongoose_1.Types.ObjectId(),
                    clientId: createUserDto.clientId,
                },
                {
                    ...mockAreaStub,
                    _id: new mongoose_1.Types.ObjectId(),
                    clientId: new mongoose_1.Types.ObjectId(),
                },
            ]);
            const response = await request(httpServer)
                .get('/areas')
                .set('Authorization', adminToken);
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(3);
        });
        it(`should be able to return a area by id`, async () => {
            const mockAreaStub = (0, area_stub_1.areaStubs)((0, areaDTO_stub_1.areaDtoStubs)());
            await dbConnection.collection('areas').insertOne(mockAreaStub);
            const response = await request(httpServer)
                .get(`/areas/${mockAreaStub._id.toString()}`)
                .set('Authorization', adminToken);
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(mockAreaStub);
        });
        it('should be able to create a area', async () => {
            const mockAreaStub = (0, areaDTO_stub_1.areaDtoStubs)();
            const response = await request(httpServer)
                .post(`/areas`)
                .send(mockAreaStub)
                .set('Authorization', adminToken);
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject((0, area_stub_1.areaStubs)(mockAreaStub));
        });
        it('shouldnt be able to create a area', async () => {
            const mockAreaStub = (0, areaDTO_stub_1.areaDtoStubs)();
            const response = await request(httpServer)
                .post(`/areas`)
                .send({ ...mockAreaStub, clientId: null })
                .set('Authorization', adminToken);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('ClientId é obrigatório');
        });
        it('should be able to update a area', async () => {
            const mockAreaStub = (0, area_stub_1.areaStubs)((0, areaDTO_stub_1.areaDtoStubs)());
            const mockAreaStubUpdate = (0, areaDTO_stub_1.areaDtoStubs)({ name: 'Updated area' });
            await dbConnection.collection('areas').insertOne(mockAreaStub);
            const response = await request(httpServer)
                .put(`/areas/${mockAreaStub._id}`)
                .send(mockAreaStubUpdate)
                .set('Authorization', adminToken);
            expect(response.status).toBe(200);
            expect(response.body.name).toEqual(mockAreaStubUpdate.name);
        });
        it('should be able to delete a area', async () => {
            const mockAreaStub = (0, area_stub_1.areaStubs)((0, areaDTO_stub_1.areaDtoStubs)());
            await dbConnection.collection('areas').insertOne(mockAreaStub);
            const response = await request(httpServer)
                .delete(`/areas/${mockAreaStub._id}`)
                .set('Authorization', adminToken);
            expect(response.status).toBe(200);
        });
        afterAll(async () => {
            await dbConnection
                .collection('users')
                .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
            await dbConnection.collection('areas').deleteMany({});
        });
    });
    afterAll(async () => {
        await app.close();
    });
});
//# sourceMappingURL=area.e2e-spec.js.map