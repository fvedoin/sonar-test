"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("mongoose");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
const generateCSVQuality_stubs_1 = require("../../stubs/generateCSVQuality.stubs");
const uc_stubs_1 = require("../../stubs/uc.stubs");
const bucket_stub_1 = require("../../stubs/bucket.stub");
describe('Xml', () => {
    let app;
    let dbConnection;
    let httpServer;
    let userService;
    let responseAuthenticate;
    let token;
    const ucId = new mongoose_1.Types.ObjectId();
    const deviceId = new mongoose_1.Types.ObjectId();
    const bucketId = new mongoose_1.Types.ObjectId();
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
        await dbConnection.collection('ucs').deleteOne({ _id: ucId });
        await dbConnection.collection('devices').deleteOne({ _id: deviceId });
        await dbConnection.collection('buckets').deleteOne({ _id: bucketId });
        await dbConnection.collection('ucs').deleteMany({});
        await dbConnection.collection('devices').deleteMany({});
    });
    it('should return 201 when generate CSV quality', async () => {
        const dto = (0, generateCSVQuality_stubs_1.generateCSVQualityStubs)();
        const mockUc = (0, uc_stubs_1.ucStubs)();
        const mockDevice = (0, uc_stubs_1.ucStubs)().deviceId;
        const mockBucket = (0, bucket_stub_1.bucketStubs)(bucketId);
        await dbConnection.collection('buckets').insertOne(mockBucket);
        await dbConnection
            .collection('devices')
            .insertOne({ ...mockDevice, _id: deviceId, bucketId });
        await dbConnection
            .collection('ucs')
            .insertOne({ ...mockUc, _id: ucId, deviceId });
        const response = await request(httpServer)
            .post('/xml/export-csv-quality')
            .set('Authorization', token)
            .send(dto);
        expect(response.status).toBe(201);
    }, 100000);
    afterAll(async () => {
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
        await dbConnection.close();
        await app.close();
    });
});
//# sourceMappingURL=xml.e2e-spec.js.map