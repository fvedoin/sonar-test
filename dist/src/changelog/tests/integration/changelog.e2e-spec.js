"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
const changelog_stub_1 = require("../../stubs/changelog.stub");
const changelogDTO_stub_1 = require("../../stubs/changelogDTO.stub");
const updateChangelogDTO_stub_1 = require("../../stubs/updateChangelogDTO.stub");
describe('Changelog', () => {
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
        await dbConnection.collection('changelogs').deleteMany({});
    });
    it(`should be able to return all changelogs`, async () => {
        const mockChangelogStub = (0, changelog_stub_1.createChangeLogWithId)((0, changelogDTO_stub_1.createChangelogDto)());
        await dbConnection.collection('changelogs').insertOne(mockChangelogStub);
        const response = await request(httpServer)
            .get('/changelogs')
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject([mockChangelogStub]);
    });
    it(`should be able to return a changelog by id`, async () => {
        const mockChangelogStub = (0, changelog_stub_1.createChangeLogWithId)((0, changelogDTO_stub_1.createChangelogDto)());
        await dbConnection.collection('changelogs').insertOne(mockChangelogStub);
        const response = await request(httpServer)
            .get(`/changelogs/${mockChangelogStub._id}`)
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(mockChangelogStub);
    });
    it('should be able to create a changelog', async () => {
        const mockChangelogStub = (0, changelog_stub_1.createChangeLogWithId)((0, changelogDTO_stub_1.createChangelogDto)());
        const response = await request(httpServer)
            .post(`/changelogs`)
            .send(mockChangelogStub)
            .set('Authorization', token);
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(mockChangelogStub);
    });
    it('should be able to update a changelog', async () => {
        const mockChangelogStub = (0, changelog_stub_1.createChangeLogWithId)((0, changelogDTO_stub_1.createChangelogDto)());
        const mockSettingStubUpdate = (0, updateChangelogDTO_stub_1.updateChangelogDto)({
            description: 'Updatedchangelog',
        });
        await dbConnection.collection('changelogs').insertOne(mockChangelogStub);
        const response = await request(httpServer)
            .put(`/changelogs/${mockChangelogStub._id}`)
            .send(mockSettingStubUpdate)
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(response.body.description).toEqual(mockSettingStubUpdate.description);
    });
    it('should be able to delete a changelog', async () => {
        const mockChangelogStub = (0, changelog_stub_1.createChangeLogWithId)((0, changelogDTO_stub_1.createChangelogDto)());
        await dbConnection.collection('changelogs').insertOne(mockChangelogStub);
        const response = await request(httpServer)
            .delete(`/changelogs/${mockChangelogStub._id}`)
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
//# sourceMappingURL=changelog.e2e-spec.js.map