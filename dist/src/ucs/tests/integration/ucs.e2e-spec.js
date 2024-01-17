"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("mongoose");
const axios_1 = require("axios");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
const uc_stub_1 = require("../../stubs/uc.stub");
const ucDto_stub_1 = require("../../stubs/ucDto.stub");
const ucCsv_stub_1 = require("../../stubs/ucCsv.stub");
const deviceGB_stub_1 = require("../../stubs/deviceGB.stub");
const bucket_stub_1 = require("../../stubs/bucket.stub");
const transformer_stub_1 = require("../../stubs/transformer.stub");
const client_stub_1 = require("../../stubs/client.stub");
const influxConnection_stub_1 = require("../../stubs/influxConnection.stub");
const queryGetAllData_1 = require("../../../influx/utils/queryGetAllData");
const devices_gb_service_1 = require("../../../devices-gb/devices-gb.service");
const application_stub_1 = require("../../../devices-gb/stubs/application.stub");
const ttn_service_1 = require("../../../common/services/ttn.service");
const Role_1 = require("../../../auth/models/Role");
describe('Ucs', () => {
    let app;
    let dbConnection;
    let httpServer;
    let userService;
    let responseAuthenticate;
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
    describe('User - Role.ADMIN', () => {
        let token;
        beforeAll(async () => {
            const createUserDto = (0, userDTO_stub_1.userDTOStub)({
                accessLevel: Role_1.Role.SUPER_ADMIN,
            });
            await userService.create(createUserDto);
            responseAuthenticate = await request(httpServer).post('/login').send({
                username: createUserDto.username,
                password: createUserDto.password,
            });
            token = `Bearer ${responseAuthenticate.body.access_token}`;
        });
        beforeEach(async () => {
            await dbConnection
                .collection('ucs')
                .deleteMany({ routeCode: (0, ucDto_stub_1.ucDtoStubs)().routeCode });
            await dbConnection.collection('ucs').deleteMany({});
            await dbConnection.collection('devices').deleteMany({});
            await dbConnection.collection('clients').deleteMany({});
            await dbConnection.collection('buckets').deleteMany({});
            await dbConnection.collection('influxconnections').deleteMany({});
            await dbConnection.collection('offlinealertjobs').deleteMany({});
            await dbConnection.collection('applications').deleteMany({});
            await dbConnection.collection('transformers').deleteMany({});
        });
        it(`should be able to return all ucs`, async () => {
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)());
            await dbConnection.collection('ucs').insertOne({
                ...mockUcsStub,
                clientId: new mongoose_1.Types.ObjectId(mockUcsStub.clientId.toString()),
            });
            const clientMock = (0, client_stub_1.clientStub)(mockUcsStub.clientId.toString());
            await dbConnection.collection('clients').insertOne(clientMock);
            const response = await request(httpServer)
                .get('/ucs')
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body[0]._id).toBeDefined();
        });
        it(`should be able to return all ucs using filter clientId.name`, async () => {
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)());
            const ucs = [];
            for (let i = 0; i < 2; i++) {
                ucs.push({
                    ...mockUcsStub,
                    _id: new mongoose_1.Types.ObjectId(),
                    deviceId: new mongoose_1.Types.ObjectId(),
                    ucCode: new mongoose_1.Types.ObjectId().toString(),
                    clientId: new mongoose_1.Types.ObjectId(mockUcsStub.clientId.toString()),
                });
            }
            const clientId = new mongoose_1.Types.ObjectId();
            await dbConnection.collection('clients').insertOne({
                name: 'Client 0',
                address: 'Testing Address',
                cnpj: '11111',
                initials: '1111',
                local: '111',
                modules: ['test'],
                _id: new mongoose_1.Types.ObjectId(),
                it: new mongoose_1.Types.ObjectId(),
            });
            await dbConnection.collection('clients').insertOne({
                name: 'Client 1',
                address: 'Testing Address',
                cnpj: '11111',
                initials: '1111',
                local: '111',
                modules: ['test'],
                _id: clientId,
                it: new mongoose_1.Types.ObjectId(),
            });
            for (let i = 0; i < 2; i++) {
                ucs.push({
                    ...mockUcsStub,
                    ucCode: new mongoose_1.Types.ObjectId().toString(),
                    _id: new mongoose_1.Types.ObjectId(),
                    deviceId: new mongoose_1.Types.ObjectId(),
                    clientId,
                });
            }
            await dbConnection.collection('ucs').insertMany(ucs);
            const response = await request(httpServer)
                .get(`/ucs/paginate?filter[0][clientId.name][0]=Client 1`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            expect(response.body.data[0]._id).toBeDefined();
        });
        it(`should be able to return all ucs using filter deviceId.allows`, async () => {
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)());
            const ucs = [];
            const devicesIds = [];
            for (let i = 0; i < 2; i++) {
                devicesIds.push({
                    devId: new mongoose_1.Types.ObjectId().toString(),
                    _id: new mongoose_1.Types.ObjectId(),
                    allows: ['quality'],
                });
            }
            for (let i = 0; i < 2; i++) {
                devicesIds.push({
                    devId: new mongoose_1.Types.ObjectId().toString(),
                    _id: new mongoose_1.Types.ObjectId(),
                    allows: ['measurements'],
                });
            }
            for (let i = 0; i < 2; i++) {
                devicesIds.push({
                    devId: new mongoose_1.Types.ObjectId().toString(),
                    _id: new mongoose_1.Types.ObjectId(),
                    allows: ['faults'],
                });
            }
            await dbConnection.collection('devices').insertMany(devicesIds);
            for (let i = 0; i < 6; i++) {
                ucs.push({
                    ...mockUcsStub,
                    _id: new mongoose_1.Types.ObjectId(),
                    deviceId: devicesIds[i]._id,
                    ucCode: new mongoose_1.Types.ObjectId().toString(),
                    clientId: new mongoose_1.Types.ObjectId(mockUcsStub.clientId.toString()),
                });
            }
            await dbConnection.collection('ucs').insertMany(ucs);
            await dbConnection
                .collection('clients')
                .insertOne((0, client_stub_1.clientStub)(mockUcsStub.clientId.toString()));
            const response = await request(httpServer)
                .get(`/ucs/paginate?filter[0][deviceId.allows][0]=quality&filter[0][deviceId.allows][1]=measurements`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(4);
            expect(response.body.data[0]._id).toBeDefined();
        });
        it(`should be able to return all ucs using filter deviceId.devId=Ativada`, async () => {
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)());
            const ucs = [];
            const devicesIds = [];
            for (let i = 0; i < 2; i++) {
                devicesIds.push({
                    devId: `ucd-${new mongoose_1.Types.ObjectId()}`,
                    _id: new mongoose_1.Types.ObjectId(),
                    allows: ['quality'],
                });
            }
            for (let i = 0; i < 2; i++) {
                devicesIds.push({
                    devId: `fxr-${new mongoose_1.Types.ObjectId()}`,
                    _id: new mongoose_1.Types.ObjectId(),
                    allows: ['measurements'],
                });
            }
            await dbConnection.collection('devices').insertMany(devicesIds);
            for (let i = 0; i < 4; i++) {
                ucs.push({
                    ...mockUcsStub,
                    _id: new mongoose_1.Types.ObjectId(),
                    deviceId: devicesIds[i]._id,
                    ucCode: new mongoose_1.Types.ObjectId().toString(),
                    clientId: new mongoose_1.Types.ObjectId(mockUcsStub.clientId.toString()),
                });
            }
            await dbConnection.collection('ucs').insertMany(ucs);
            await dbConnection
                .collection('clients')
                .insertOne((0, client_stub_1.clientStub)(mockUcsStub.clientId.toString()));
            const response = await request(httpServer)
                .get(`/ucs/paginate?filter[0][deviceId.devId][0]=Ativada`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            const reg = /^(?!ucd)/;
            for (const data of response.body.data) {
                expect(data.deviceId.devId).toMatch(reg);
            }
        });
        it(`should be able to return all ucs using filter deviceId.devId=Desativada`, async () => {
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)());
            const ucs = [];
            const devicesIds = [];
            for (let i = 0; i < 2; i++) {
                devicesIds.push({
                    devId: `ucd-${i}`,
                    _id: new mongoose_1.Types.ObjectId(),
                    allows: ['quality'],
                });
            }
            for (let i = 0; i < 2; i++) {
                devicesIds.push({
                    devId: `fxr-${i}`,
                    _id: new mongoose_1.Types.ObjectId(),
                    allows: ['measurements'],
                });
            }
            await dbConnection.collection('devices').insertMany(devicesIds);
            for (let i = 0; i < 4; i++) {
                ucs.push({
                    ...mockUcsStub,
                    _id: new mongoose_1.Types.ObjectId(),
                    deviceId: devicesIds[i]._id,
                    ucCode: new mongoose_1.Types.ObjectId().toString(),
                    clientId: new mongoose_1.Types.ObjectId(mockUcsStub.clientId.toString()),
                });
            }
            await dbConnection.collection('ucs').insertMany(ucs);
            await dbConnection
                .collection('clients')
                .insertOne((0, client_stub_1.clientStub)(mockUcsStub.clientId.toString()));
            const response = await request(httpServer)
                .get(`/ucs/paginate?filter[0][deviceId.devId][0]=Desativada`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            const reg = /^ucd/;
            for (const data of response.body.data) {
                expect(data.deviceId.devId).toMatch(reg);
            }
        });
        it(`should be able to return all ucs`, async () => {
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)());
            await dbConnection.collection('ucs').insertOne({
                ...mockUcsStub,
                clientId: new mongoose_1.Types.ObjectId(mockUcsStub.clientId.toString()),
            });
            const response = await request(httpServer)
                .get('/ucs')
                .query({ clientId: (0, ucDto_stub_1.ucDtoStubs)().clientId.toString() })
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body[0]._id).toBeDefined();
        });
        it(`should be able to return a uc by id`, async () => {
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)());
            await dbConnection.collection('ucs').insertOne(mockUcsStub);
            const response = await request(httpServer)
                .get(`/ucs/${mockUcsStub._id}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body._id.toString()).toEqual(mockUcsStub._id.toString());
        });
        it('should be able to create a uc', async () => {
            const mockUcsStub = (0, ucDto_stub_1.ucDtoStubs)();
            const response = await request(httpServer)
                .post(`/ucs`)
                .send(mockUcsStub)
                .set('Authorization', token);
            expect(response.status).toBe(201);
            expect(response.body._id).toBeDefined();
        });
        it('should be able to update a uc', async () => {
            const deviceId = new mongoose_1.Types.ObjectId('640667dd2d824a3ec7cde788').toString();
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)({ ucCode: '123', deviceId }));
            const mockUcStubUpdate = (0, ucDto_stub_1.ucDtoStubs)({ ucCode: '1253' });
            const mockDeviceGBStub = (0, deviceGB_stub_1.deviceGBStub)(deviceId);
            await dbConnection.collection('ucs').insertOne(mockUcsStub);
            await dbConnection.collection('devices').insertOne(mockDeviceGBStub);
            const response = await request(httpServer)
                .put(`/ucs/${mockUcsStub._id}`)
                .send(mockUcStubUpdate)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.ucCode).toEqual(mockUcStubUpdate.ucCode);
        });
        describe('should be able to disable', () => {
            it('success - transfer data', async () => {
                const deviceId = new mongoose_1.Types.ObjectId('640667dd2d824a3ec7cde788').toString();
                const influxConnectionStub = (0, influxConnection_stub_1.influxConnectionStubDtoStubs)({
                    host: process.env.INFLUX_HOST,
                    orgId: process.env.INFLUX_ORG_ID,
                    apiToken: process.env.INFLUX_API_TOKEN,
                });
                const influxConnectionCreated = await dbConnection
                    .collection('influxconnections')
                    .insertOne(influxConnectionStub);
                const bucketId = new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6');
                const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)({ ucCode: '123', deviceId }));
                const mockDeviceGBStub = (0, deviceGB_stub_1.deviceGBStub)(deviceId);
                const mockBucketStub = (0, bucket_stub_1.bucketStubs)(bucketId, (0, bucket_stub_1.bucketDtoStubs)({
                    clientId: mockUcsStub.clientId.toString(),
                    influxConnectionId: influxConnectionCreated.insertedId.toString(),
                }));
                await dbConnection
                    .collection('clients')
                    .insertOne((0, client_stub_1.clientStub)(mockUcsStub.clientId.toString()));
                await dbConnection.collection('ucs').insertOne(mockUcsStub);
                await dbConnection.collection('devices').insertOne(mockDeviceGBStub);
                await dbConnection.collection('buckets').insertOne(mockBucketStub);
                const axiosPostSpy = jest.spyOn(axios_1.default, 'post');
                const deviceGBSpy = jest.spyOn(devices_gb_service_1.DevicesGbService.prototype, 'create');
                const newDevice = {
                    clientId: mockUcsStub.clientId.toString(),
                    devId: `ucd-${mockUcsStub.ucCode}`,
                    bucketId: mockBucketStub._id.toString(),
                    name: `UC ${mockUcsStub.ucCode} desativada`,
                    allows: mockDeviceGBStub.allows,
                    communication: 'PIMA',
                    type: 'LoRa',
                    databaseId: expect.any(String),
                };
                const response = await request(httpServer)
                    .put(`/ucs/disable/${mockUcsStub._id}`)
                    .set('Authorization', token);
                expect(deviceGBSpy).toHaveBeenCalledWith(newDevice, expect.anything());
                expect(axiosPostSpy).toHaveBeenCalledWith(`${influxConnectionStub.host}/api/v2/query`, (0, queryGetAllData_1.default)({
                    bucketName: mockBucketStub.name,
                    devId: mockDeviceGBStub.devId,
                }), {
                    headers: {
                        Accept: 'application/csv',
                        Authorization: `Token ${influxConnectionStub.apiToken}`,
                        'Content-type': 'application/vnd.flux',
                    },
                    params: {
                        chunk_size: '10000',
                        chunked: 'true',
                        orgID: influxConnectionStub.orgId,
                    },
                    responseType: 'stream',
                });
                expect(response.status).toBe(200);
                axiosPostSpy.mockRestore();
                deviceGBSpy.mockRestore();
            });
            it('success - transfer data & remove data', async () => {
                const deviceId = new mongoose_1.Types.ObjectId('640667dd2d824a3ec7cde788').toString();
                const influxConnectionStub = (0, influxConnection_stub_1.influxConnectionStubDtoStubs)({
                    host: process.env.INFLUX_HOST,
                    orgId: process.env.INFLUX_ORG_ID,
                    apiToken: process.env.INFLUX_API_TOKEN,
                });
                const influxConnectionCreated = await dbConnection
                    .collection('influxconnections')
                    .insertOne(influxConnectionStub);
                const bucketId = new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6');
                const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)({ ucCode: '123', deviceId }));
                const mockDeviceGBStub = (0, deviceGB_stub_1.deviceGBStub)(deviceId);
                const mockBucketStub = (0, bucket_stub_1.bucketStubs)(bucketId, (0, bucket_stub_1.bucketDtoStubs)({
                    clientId: mockUcsStub.clientId.toString(),
                    influxConnectionId: influxConnectionCreated.insertedId.toString(),
                }));
                await dbConnection
                    .collection('clients')
                    .insertOne((0, client_stub_1.clientStub)(mockUcsStub.clientId.toString()));
                await dbConnection.collection('ucs').insertOne(mockUcsStub);
                await dbConnection.collection('devices').insertOne(mockDeviceGBStub);
                await dbConnection.collection('buckets').insertOne(mockBucketStub);
                const axiosPostSpy = jest.spyOn(axios_1.default, 'post');
                const deviceGBSpy = jest.spyOn(devices_gb_service_1.DevicesGbService.prototype, 'create');
                const newDevice = {
                    clientId: mockUcsStub.clientId.toString(),
                    devId: `ucd-${mockUcsStub.ucCode}`,
                    bucketId: mockBucketStub._id.toString(),
                    name: `UC ${mockUcsStub.ucCode} desativada`,
                    allows: mockDeviceGBStub.allows,
                    communication: 'PIMA',
                    type: 'LoRa',
                    databaseId: expect.any(String),
                };
                const response = await request(httpServer)
                    .put(`/ucs/disable/${mockUcsStub._id}`)
                    .send({ deleteData: true })
                    .set('Authorization', token);
                expect(deviceGBSpy).toHaveBeenCalledWith(newDevice, expect.anything());
                expect(axiosPostSpy).toHaveBeenNthCalledWith(1, `${influxConnectionStub.host}/api/v2/query`, (0, queryGetAllData_1.default)({
                    bucketName: mockBucketStub.name,
                    devId: mockDeviceGBStub.devId,
                }), {
                    headers: {
                        Accept: 'application/csv',
                        Authorization: `Token ${influxConnectionStub.apiToken}`,
                        'Content-type': 'application/vnd.flux',
                    },
                    params: {
                        chunk_size: '10000',
                        chunked: 'true',
                        orgID: influxConnectionStub.orgId,
                    },
                    responseType: 'stream',
                });
                expect(axiosPostSpy).toHaveBeenNthCalledWith(2, `${influxConnectionStub.host}/api/v2/delete`, {
                    predicate: `"dev_id" = "${mockDeviceGBStub.devId}"`,
                    start: expect.any(String),
                    stop: expect.any(String),
                }, {
                    params: {
                        orgID: influxConnectionStub.orgId,
                        bucket: mockBucketStub.name,
                    },
                    headers: {
                        Authorization: `Token ${influxConnectionStub.apiToken}`,
                        encoding: 'json',
                        Accept: 'application/json',
                        'Content-type': 'application/json',
                    },
                });
                expect(response.status).toBe(200);
                axiosPostSpy.mockRestore();
                deviceGBSpy.mockRestore();
            });
        });
        describe('should be able to change device', () => {
            it('success - transfer data', async () => {
                const deviceId = new mongoose_1.Types.ObjectId('640667dd2d824a3ec7cde788').toString();
                const applicationId = new mongoose_1.Types.ObjectId('640667dd2d824a3ec7cde788');
                const deviceId2 = new mongoose_1.Types.ObjectId().toString();
                const influxConnectionStub = (0, influxConnection_stub_1.influxConnectionStubDtoStubs)({
                    host: process.env.INFLUX_HOST,
                    orgId: process.env.INFLUX_ORG_ID,
                    apiToken: process.env.INFLUX_API_TOKEN,
                });
                const influxConnectionCreated = await dbConnection
                    .collection('influxconnections')
                    .insertOne(influxConnectionStub);
                const bucketId = new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6');
                const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)({ ucCode: '123', deviceId }));
                const ucDevice = (0, deviceGB_stub_1.deviceGBStub)(deviceId);
                const deviceToChange = (0, deviceGB_stub_1.deviceGBStub)(deviceId2, {
                    devId: 'teste2',
                    applicationId,
                });
                const mockBucketStub = (0, bucket_stub_1.bucketStubs)(bucketId, (0, bucket_stub_1.bucketDtoStubs)({
                    clientId: mockUcsStub.clientId.toString(),
                    influxConnectionId: influxConnectionCreated.insertedId.toString(),
                }));
                const application = (0, application_stub_1.applicationStubs)(applicationId);
                await dbConnection
                    .collection('clients')
                    .insertOne((0, client_stub_1.clientStub)(mockUcsStub.clientId.toString()));
                await dbConnection.collection('ucs').insertOne(mockUcsStub);
                await dbConnection.collection('devices').insertOne(ucDevice);
                await dbConnection.collection('devices').insertOne(deviceToChange);
                await dbConnection.collection('applications').insertOne(application);
                await dbConnection.collection('buckets').insertOne(mockBucketStub);
                const axiosPostSpy = jest.spyOn(axios_1.default, 'post');
                const deviceGBSpy = jest.spyOn(devices_gb_service_1.DevicesGbService.prototype, 'create');
                const dev_eui = '123456';
                const TtnServiceSpy = jest.spyOn(ttn_service_1.TtnService, 'get');
                TtnServiceSpy.mockResolvedValue({
                    data: {
                        ids: { dev_eui },
                    },
                });
                const response = await request(httpServer)
                    .put(`/ucs/change-device/${mockUcsStub._id}`)
                    .send({
                    deviceId: deviceToChange._id,
                })
                    .set('Authorization', token);
                expect(TtnServiceSpy).toHaveBeenNthCalledWith(1, `applications/${application.appId}/devices/${deviceToChange.devId}`);
                expect(axiosPostSpy).toHaveBeenNthCalledWith(1, `${influxConnectionStub.host}/api/v2/query`, (0, queryGetAllData_1.default)({
                    bucketName: mockBucketStub.name,
                    devId: ucDevice.devId,
                }), {
                    headers: {
                        Accept: 'application/csv',
                        Authorization: `Token ${influxConnectionStub.apiToken}`,
                        'Content-type': 'application/vnd.flux',
                    },
                    params: {
                        chunk_size: '10000',
                        chunked: 'true',
                        orgID: influxConnectionStub.orgId,
                    },
                    responseType: 'stream',
                });
                expect(response.status).toBe(200);
                axiosPostSpy.mockRestore();
                deviceGBSpy.mockRestore();
                TtnServiceSpy.mockRestore();
            });
            it('success - transfer data & delete Data', async () => {
                const deviceId = new mongoose_1.Types.ObjectId('640667dd2d824a3ec7cde788').toString();
                const applicationId = new mongoose_1.Types.ObjectId('640667dd2d824a3ec7cde788');
                const deviceId2 = new mongoose_1.Types.ObjectId().toString();
                const influxConnectionStub = (0, influxConnection_stub_1.influxConnectionStubDtoStubs)({
                    host: process.env.INFLUX_HOST,
                    orgId: process.env.INFLUX_ORG_ID,
                    apiToken: process.env.INFLUX_API_TOKEN,
                });
                const influxConnectionCreated = await dbConnection
                    .collection('influxconnections')
                    .insertOne(influxConnectionStub);
                const bucketId = new mongoose_1.Types.ObjectId('62179b4f4e4e0029f068f7b6');
                const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)({ ucCode: '123', deviceId }));
                const ucDevice = (0, deviceGB_stub_1.deviceGBStub)(deviceId);
                const deviceToChange = (0, deviceGB_stub_1.deviceGBStub)(deviceId2, {
                    devId: 'teste2',
                    applicationId,
                });
                const mockBucketStub = (0, bucket_stub_1.bucketStubs)(bucketId, (0, bucket_stub_1.bucketDtoStubs)({
                    clientId: mockUcsStub.clientId.toString(),
                    influxConnectionId: influxConnectionCreated.insertedId.toString(),
                }));
                const application = (0, application_stub_1.applicationStubs)(applicationId);
                await dbConnection
                    .collection('clients')
                    .insertOne((0, client_stub_1.clientStub)(mockUcsStub.clientId.toString()));
                await dbConnection.collection('ucs').insertOne(mockUcsStub);
                await dbConnection.collection('devices').insertOne(ucDevice);
                await dbConnection.collection('devices').insertOne(deviceToChange);
                await dbConnection.collection('applications').insertOne(application);
                await dbConnection.collection('buckets').insertOne(mockBucketStub);
                const axiosPostSpy = jest.spyOn(axios_1.default, 'post');
                const deviceGBSpy = jest.spyOn(devices_gb_service_1.DevicesGbService.prototype, 'create');
                const dev_eui = '123456';
                const TtnServiceSpy = jest.spyOn(ttn_service_1.TtnService, 'get');
                TtnServiceSpy.mockResolvedValue({
                    data: {
                        ids: { dev_eui },
                    },
                });
                const response = await request(httpServer)
                    .put(`/ucs/change-device/${mockUcsStub._id}`)
                    .send({
                    deviceId: deviceToChange._id,
                    deleteData: true,
                })
                    .set('Authorization', token);
                expect(TtnServiceSpy).toHaveBeenNthCalledWith(1, `applications/${application.appId}/devices/${deviceToChange.devId}`);
                expect(axiosPostSpy).toHaveBeenNthCalledWith(1, `${influxConnectionStub.host}/api/v2/query`, (0, queryGetAllData_1.default)({
                    bucketName: mockBucketStub.name,
                    devId: ucDevice.devId,
                }), {
                    headers: {
                        Accept: 'application/csv',
                        Authorization: `Token ${influxConnectionStub.apiToken}`,
                        'Content-type': 'application/vnd.flux',
                    },
                    params: {
                        chunk_size: '10000',
                        chunked: 'true',
                        orgID: influxConnectionStub.orgId,
                    },
                    responseType: 'stream',
                });
                expect(axiosPostSpy).toHaveBeenNthCalledWith(2, `${influxConnectionStub.host}/api/v2/delete`, {
                    predicate: `"dev_id" = "${ucDevice.devId}"`,
                    start: expect.any(String),
                    stop: expect.any(String),
                }, {
                    params: {
                        orgID: influxConnectionStub.orgId,
                        bucket: mockBucketStub.name,
                    },
                    headers: {
                        Authorization: `Token ${influxConnectionStub.apiToken}`,
                        encoding: 'json',
                        Accept: 'application/json',
                        'Content-type': 'application/json',
                    },
                });
                expect(response.status).toBe(200);
                axiosPostSpy.mockRestore();
                deviceGBSpy.mockRestore();
                TtnServiceSpy.mockRestore();
            });
        });
        it('should be able to delete a uc', async () => {
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)());
            await dbConnection.collection('ucs').insertOne(mockUcsStub);
            const response = await request(httpServer)
                .delete(`/ucs/${mockUcsStub._id}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
        });
        it('should be able to delete many a ucs', async () => {
            const mockUcStub1 = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)({
                ucCode: '789',
                deviceId: new mongoose_1.Types.ObjectId().toString(),
            }));
            const mockUcStub2 = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)({ ucCode: '456' }), '63e53e35be706a6dabdd4000');
            await dbConnection.collection('ucs').insertOne(mockUcStub1);
            await dbConnection.collection('ucs').insertOne(mockUcStub2);
            const response = await request(httpServer)
                .delete(`/ucs/many/${mockUcStub1._id},${mockUcStub2._id}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
        });
        it('should be able to find a uc by code', async () => {
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)());
            await dbConnection.collection('ucs').insertOne(mockUcsStub);
            await dbConnection
                .collection('transformers')
                .insertOne((0, transformer_stub_1.transformerStubs)('3'));
            const response = await request(httpServer)
                .get(`/ucs/details/ucCode/${mockUcsStub.ucCode}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.ucCode).toEqual(mockUcsStub.ucCode);
        });
        it('should return 401 Forbidden if not authorized', async () => {
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)());
            await dbConnection.collection('ucs').insertOne(mockUcsStub);
            const response = await request(httpServer)
                .get(`/ucs/details/ucCode/${mockUcsStub.ucCode}`)
                .set('Authorization', 'Bearer invalid_token');
            expect(response.status).toBe(401);
        });
        it('should return lastReceived TUSD-G', async () => {
            const mockUcsStub = { ucCode: '222' };
            await dbConnection.collection('ucs').insertOne(mockUcsStub);
            const response = await request(httpServer)
                .get(`/ucs/details/ucCode/${mockUcsStub.ucCode}`)
                .set('Authorization', token);
            response.body.lastReceived.push({
                port: 6,
                package: {
                    port: 6,
                    peak_demand_consumed: 1111,
                    peak_demand_generated: 0,
                    offpeak_demand_consumed: 985,
                    offpeak_demand_generated: 444,
                    cable_status: 1,
                },
                receivedAt: '2023-09-29T12:59:03.085Z',
            });
            const lastReceived = response.body.lastReceived[0].package;
            expect(lastReceived.offpeak_demand_consumed).toBe(985);
            expect(lastReceived.offpeak_demand_generated).toBe(444);
            expect(lastReceived.peak_demand_consumed).toBe(1111);
            expect(lastReceived.peak_demand_generated).toBe(0);
        });
        it('should be able to create many ucs', async () => {
            const mockUcCsvStub = (0, ucCsv_stub_1.ucCsvStub)();
            const response = await request(httpServer)
                .post(`/ucs/many`)
                .send([mockUcCsvStub])
                .set('Authorization', token);
            expect(response.status).toBe(201);
            expect(response.body[0]._id).toBeDefined();
        });
        afterAll(async () => {
            await dbConnection
                .collection('users')
                .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
            await dbConnection.collection('ucs').deleteMany({});
            await dbConnection.collection('devices').deleteMany({});
            await dbConnection.collection('clients').deleteMany({});
            await dbConnection.collection('buckets').deleteMany({});
            await dbConnection.collection('influxconnections').deleteMany({});
            await dbConnection.collection('offlinealertjobs').deleteMany({});
            await dbConnection.collection('applications').deleteMany({});
            await dbConnection.collection('transformers').deleteMany({});
        });
    });
    describe('User - Role.Viewer', () => {
        let token;
        let createdUser;
        beforeAll(async () => {
            const createUserDto = (0, userDTO_stub_1.userDTOStub)({
                accessLevel: Role_1.Role.VIEWER,
            });
            createdUser = await userService.create(createUserDto);
            responseAuthenticate = await request(httpServer).post('/login').send({
                username: createUserDto.username,
                password: createUserDto.password,
            });
            token = `Bearer ${responseAuthenticate.body.access_token}`;
        });
        beforeEach(async () => {
            await dbConnection
                .collection('ucs')
                .deleteMany({ routeCode: (0, ucDto_stub_1.ucDtoStubs)().routeCode });
            await dbConnection.collection('ucs').deleteMany({});
            await dbConnection.collection('devices').deleteMany({});
            await dbConnection.collection('clients').deleteMany({});
            await dbConnection.collection('buckets').deleteMany({});
            await dbConnection.collection('influxconnections').deleteMany({});
            await dbConnection.collection('offlinealertjobs').deleteMany({});
            await dbConnection.collection('applications').deleteMany({});
            await dbConnection.collection('transformers').deleteMany({});
        });
        it(`should be able to return all ucs`, async () => {
            const clientId2 = new mongoose_1.Types.ObjectId().toString();
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)({ clientId: createdUser.clientId }));
            const mockUcsStub2 = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)({
                clientId: clientId2,
                deviceId: '640667dd2d824a3ec7cde77f',
                ucCode: 'Teste',
            }), '640667dd2d824a3ec7cde77f');
            const clientMock = (0, client_stub_1.clientStub)(mockUcsStub.clientId.toString());
            const clientMock2 = (0, client_stub_1.clientStub)(clientId2);
            await dbConnection.collection('ucs').insertMany([
                {
                    ...mockUcsStub,
                    clientId: new mongoose_1.Types.ObjectId(createdUser.clientId.toString()),
                },
                {
                    ...mockUcsStub2,
                    clientId: new mongoose_1.Types.ObjectId(clientId2),
                },
            ]);
            await dbConnection
                .collection('clients')
                .insertMany([clientMock, clientMock2]);
            const response = await request(httpServer)
                .get('/ucs')
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]._id).toBeDefined();
        });
        it(`should be able to return all paginated ucs`, async () => {
            const mockUcsStub = (0, uc_stub_1.ucStubs)((0, ucDto_stub_1.ucDtoStubs)({ clientId: createdUser.clientId }));
            const ucs = [];
            for (let i = 0; i < 2; i++) {
                ucs.push({
                    ...mockUcsStub,
                    _id: new mongoose_1.Types.ObjectId(),
                    deviceId: new mongoose_1.Types.ObjectId(),
                    ucCode: new mongoose_1.Types.ObjectId().toString(),
                    clientId: new mongoose_1.Types.ObjectId(mockUcsStub.clientId.toString()),
                });
            }
            for (let i = 0; i < 2; i++) {
                ucs.push({
                    ...mockUcsStub,
                    ucCode: new mongoose_1.Types.ObjectId().toString(),
                    _id: new mongoose_1.Types.ObjectId(),
                    deviceId: new mongoose_1.Types.ObjectId(),
                    clientId: new mongoose_1.Types.ObjectId(),
                });
            }
            await dbConnection.collection('clients').insertOne({
                name: 'Client 1',
                address: 'Testing Address',
                cnpj: '11111',
                initials: '1111',
                local: '111',
                modules: ['test'],
                _id: new mongoose_1.Types.ObjectId(createdUser.clientId),
                it: new mongoose_1.Types.ObjectId(),
            });
            await dbConnection.collection('ucs').insertMany(ucs);
            const response = await request(httpServer)
                .get(`/ucs/paginate`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            expect(response.body.data[0]._id).toBeDefined();
            for (const uc of response.body.data) {
                expect(uc.clientId._id).toBe(createdUser.clientId);
            }
        });
        afterAll(async () => {
            await dbConnection
                .collection('users')
                .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
            await dbConnection.collection('ucs').deleteMany({});
            await dbConnection.collection('devices').deleteMany({});
            await dbConnection.collection('clients').deleteMany({});
            await dbConnection.collection('buckets').deleteMany({});
            await dbConnection.collection('influxconnections').deleteMany({});
            await dbConnection.collection('offlinealertjobs').deleteMany({});
            await dbConnection.collection('applications').deleteMany({});
            await dbConnection.collection('transformers').deleteMany({});
        });
    });
    afterAll(async () => {
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
        await app.close();
    });
});
//# sourceMappingURL=ucs.e2e-spec.js.map