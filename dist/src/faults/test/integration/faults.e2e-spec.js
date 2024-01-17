"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const ucDto_stub_1 = require("../../stubs/ucDto.stub");
const deviceGB_stub_1 = require("../../stubs/deviceGB.stub");
const bucket_stub_1 = require("../../stubs/bucket.stub");
const userDTOStub_1 = require("../../stubs/userDTOStub");
const influxConnection_stub_1 = require("../../stubs/influxConnection.stub");
describe('Faults', () => {
    let app;
    let dbConnection;
    let httpServer;
    let userService;
    let responseAuthenticate;
    let token;
    const ucCode = 'ucd-768';
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
    it(`should be able to return 400 - no uc`, async () => {
        const response = await request(httpServer)
            .get(`/faults/export-csv`)
            .query({
            dateRange: {
                startDate: '2023-09-29T15:45:00.000Z',
                endDate: '2023-09-29T15:45:00.000Z',
            },
        })
            .set('Authorization', token);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Ocorreu um erro ao exportar o CSV das faltas.');
    });
    it(`should be able to return 400 - no date range`, async () => {
        const response = await request(httpServer)
            .get(`/faults/export-csv?ucs=${ucCode}`)
            .set('Authorization', token);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Ocorreu um erro ao exportar o CSV das faltas.');
        expect(response.body.stacktrace).toBe('DateRange é obrigatório.');
    });
    describe('Inserted UC', () => {
        beforeAll(async () => {
            const deviceId = (0, ucDto_stub_1.ucDtoStubs)().deviceId;
            const mockUcsStub = (0, ucDto_stub_1.ucDtoStubs)((0, ucDto_stub_1.ucDtoStubs)({ ucCode, deviceId }));
            const mockDeviceGBStub = (0, deviceGB_stub_1.deviceGBStub)(deviceId);
            await dbConnection.collection('ucs').insertOne(mockUcsStub);
            await dbConnection.collection('devices').insertOne(mockDeviceGBStub);
        });
        afterAll(async () => {
            await dbConnection.collection('ucs').deleteMany({});
            await dbConnection.collection('devices').deleteMany({});
            await dbConnection.collection('buckets').deleteMany({});
        });
        it(`should be able to return 400 - no bucket`, async () => {
            const response = await request(httpServer)
                .get(`/faults/export-csv?ucs=${ucCode}`)
                .query({
                dateRange: {
                    startDate: '2023-09-29T15:45:00.000Z',
                    endDate: '2023-09-29T15:45:00.000Z',
                },
            })
                .set('Authorization', token);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Ocorreu um erro ao exportar o CSV das faltas.');
            expect(response.body.stacktrace).toBe('Não foi possível encontrar um bucket.');
        });
    });
    describe('Inserted UC & Bucket', () => {
        beforeAll(async () => {
            const deviceId = (0, ucDto_stub_1.ucDtoStubs)().deviceId;
            const bucketId = (0, deviceGB_stub_1.deviceGBStub)(deviceId).bucketId;
            const mockUcsStub = (0, ucDto_stub_1.ucDtoStubs)((0, ucDto_stub_1.ucDtoStubs)({ ucCode, deviceId }));
            const mockDeviceGBStub = (0, deviceGB_stub_1.deviceGBStub)(deviceId);
            const mockBucketStub = (0, bucket_stub_1.bucketStubs)(bucketId, (0, bucket_stub_1.bucketDtoStubs)({
                clientId: mockUcsStub.clientId.toString(),
            }));
            await dbConnection.collection('ucs').insertOne(mockUcsStub);
            await dbConnection.collection('devices').insertOne(mockDeviceGBStub);
            await dbConnection.collection('buckets').insertOne(mockBucketStub);
        });
        afterAll(async () => {
            await dbConnection.collection('ucs').deleteMany({});
            await dbConnection.collection('devices').deleteMany({});
            await dbConnection.collection('buckets').deleteMany({});
        });
        it(`should be able to return 400 - no influxConnection`, async () => {
            const response = await request(httpServer)
                .get(`/faults/export-csv?ucs=${ucCode}`)
                .query({
                dateRange: {
                    startDate: '2023-09-29T15:45:00.000Z',
                    endDate: '2023-09-29T15:45:00.000Z',
                },
            })
                .set('Authorization', token);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Ocorreu um erro ao exportar o CSV das faltas.');
            expect(response.body.stacktrace).toBe('Não foi possível encontrar uma conexão com o Influx.');
        });
    });
    describe('Inserted UC & Device & Bucket & Influx Connection', () => {
        beforeAll(async () => {
            const deviceId = (0, ucDto_stub_1.ucDtoStubs)().deviceId;
            const mockUcsStub = (0, ucDto_stub_1.ucDtoStubs)((0, ucDto_stub_1.ucDtoStubs)({ ucCode, deviceId }));
            const mockDeviceGBStub = (0, deviceGB_stub_1.deviceGBStub)(deviceId, { devId: ucCode });
            const influxConnectionStub = (0, influxConnection_stub_1.influxConnectionStubDtoStubs)({
                host: process.env.INFLUX_HOST,
                orgId: process.env.INFLUX_ORG_ID,
                apiToken: process.env.INFLUX_API_TOKEN,
            });
            const influxConnectionCreated = await dbConnection
                .collection('influxconnections')
                .insertOne(influxConnectionStub);
            const bucketId = (0, deviceGB_stub_1.deviceGBStub)(deviceId).bucketId;
            const mockBucketStub = (0, bucket_stub_1.bucketStubs)(bucketId, (0, bucket_stub_1.bucketDtoStubs)({
                clientId: mockUcsStub.clientId.toString(),
                influxConnectionId: influxConnectionCreated.insertedId.toString(),
            }));
            await dbConnection.collection('ucs').insertOne(mockUcsStub);
            await dbConnection.collection('devices').insertOne(mockDeviceGBStub);
            await dbConnection.collection('buckets').insertOne(mockBucketStub);
        });
        afterAll(async () => {
            await dbConnection.collection('ucs').deleteMany({});
            await dbConnection.collection('devices').deleteMany({});
            await dbConnection.collection('buckets').deleteMany({});
            await dbConnection.collection('influxconnections').deleteMany({});
        });
        it(`should be able to return 400 - no dateRange`, async () => {
            const response = await request(httpServer)
                .get(`/faults/export-csv?ucs=${ucCode}`)
                .set('Authorization', token);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Ocorreu um erro ao exportar o CSV das faltas.');
            expect(response.body.stacktrace).toBe('DateRange é obrigatório.');
        });
        it(`should be able to return all faults`, async () => {
            const response = await request(httpServer)
                .get(`/faults/export-csv?ucs=${ucCode}`)
                .query({
                dateRange: {
                    startDate: '2023-09-17T15:45:00.000Z',
                    endDate: '2023-10-29T15:45:00.000Z',
                },
            })
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.csvdoc)).toBeTruthy();
            expect(Array.isArray(response.body.jsondoc)).toBeTruthy();
        });
    });
    afterAll(async () => {
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTOStub_1.userDTOStub)().username });
        await dbConnection.collection('ucs').deleteMany({});
        await dbConnection.collection('devices').deleteMany({});
        await dbConnection.collection('buckets').deleteMany({});
        await app.close();
    });
});
//# sourceMappingURL=faults.e2e-spec.js.map