"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("mongoose");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const userDTOStub_1 = require("../../stubs/userDTOStub");
const devices_gb_stub_1 = require("../../stubs/devices-gb.stub");
const clientDTO_stub_1 = require("../../stubs/clientDTO.stub");
const influxConnection_stub_1 = require("../../stubs/influxConnection.stub");
const uc_stub_1 = require("../../stubs/uc.stub");
const ucDto_stub_1 = require("../../stubs/ucDto.stub");
const deviceGB_stub_1 = require("../../stubs/deviceGB.stub");
const bucket_stub_1 = require("../../stubs/bucket.stub");
const axios_1 = require("axios");
const ttn_service_1 = require("../../../common/services/ttn.service");
const queryGetAllData_1 = require("../../../influx/utils/queryGetAllData");
const application_stub_1 = require("../../stubs/application.stub");
const utils_1 = require("../../../utils/utils");
const Role_1 = require("../../../auth/models/Role");
describe('Devices-gb', () => {
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
    it(`should be able to return all devices-gb`, async () => {
        const mockDeviceTrStub = (0, devices_gb_stub_1.deviceGbStub)();
        await dbConnection.collection('devices').insertOne(mockDeviceTrStub);
        const response = await request(httpServer)
            .get('/devices-gb')
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    it(`should return 401 when not authenticated`, async () => {
        const response = await request(httpServer).get('/devices-gb');
        expect(response.status).toBe(401);
    });
    it(`should return devices-gb for a specific clientId`, async () => {
        const mockDeviceGbStub = (0, devices_gb_stub_1.deviceGbStub)();
        const response = await request(httpServer)
            .get(`/devices-gb?clientId=${mockDeviceGbStub.clientId}`)
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    it('should not return devices that contain "ucd-" in devId', async () => {
        const ucdDevice1 = { devId: 'ucd-d123' };
        const ucdDevice2 = { devId: 'ucd-d124' };
        await dbConnection
            .collection('devices')
            .insertMany([ucdDevice1, ucdDevice2]);
        const response = await request(httpServer)
            .get('/devices-gb')
            .set('Authorization', token);
        expect(response.status).toBe(200);
        const devices = response.body.data;
        devices.forEach((device) => {
            expect(device.devId).not.toContain('ucd-');
        });
    });
    describe(`should be able to return devices using filtering`, () => {
        const devices = [];
        const mockDevicesStub = (0, devices_gb_stub_1.deviceGbStub)();
        const mockClientStub = (0, clientDTO_stub_1.clientStub)(mockDevicesStub.clientId);
        beforeAll(async () => {
            devices.push({
                type: 'LoRa',
                devId: 'fxrl-02',
                name: 'fxrl-02',
                communication: 'PIMA',
                description: '',
                allows: ['Medidas instantâneas'],
                clientId,
                _id: new mongoose_1.Types.ObjectId(),
            });
            devices.push({
                type: 'teste',
                devId: 'fxrl-03',
                name: 'fxrl-03',
                communication: 'teste',
                description: '',
                allows: ['Corte/religa'],
                clientId,
                _id: new mongoose_1.Types.ObjectId(),
            });
            await dbConnection.collection('devices').insertMany(devices);
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
        it(`should be able to return 2 devices filtered by 'clientId'`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&clientId=${clientId.toString()}&fieldMask[clientId]=1,fieldMask[devId]=1&fieldMask[name]=1&fieldMask[description]=1`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            for (const devices of response.body.data) {
                expect(devices.clientId._id).toEqual(clientId.toString());
            }
        });
        it(`should be able to return devices filtered by 'searchText'`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&searchText=${mockDevicesStub.name}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const devices of response.body.data) {
                expect(devices.clientId.name).toEqual(mockClientStub.name);
            }
        });
        it(`should be able to return devices 1 filtered by allows`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][allows][0]=${mockDevicesStub.allows[0]}&filter[0][allows][1]=${mockDevicesStub.allows[1]}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const devices of response.body.data) {
                expect(devices.allows[0]).toEqual(mockDevicesStub.allows[0]);
                expect(devices.allows[1]).toEqual(mockDevicesStub.allows[1]);
            }
        });
        it(`should be able to return devices (2) all filtered by allows`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][allows][0]=${devices[0].allows[0]}&filter[0][allows][1]=${mockDevicesStub.allows[1]}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
        });
        it(`should be able to return 2 devices filtered by type and ucCode`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][type][0]=${mockDevicesStub.type}&filter[1][communication][0]=${mockDevicesStub.communication}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            for (const devices of response.body.data) {
                expect(devices.type).toEqual(mockDevicesStub.type);
                expect(devices.communication).toEqual(mockDevicesStub.communication);
            }
        });
        it(`should be able to return 1 devices filtered by type and ucCode`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][type][0]=${devices[1].type}&filter[1][communication][0]=${devices[1].communication}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const device of response.body.data) {
                expect(device.type).toEqual(devices[1].type);
                expect(device.communication).toEqual(devices[1].communication);
            }
        });
        it(`should be able to return 1 devices filtered by type and ucCode`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][type][0]=${devices[1].type}&filter[1][communication][0]=${devices[1].communication}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const device of response.body.data) {
                expect(device.type).toEqual(devices[1].type);
                expect(device.communication).toEqual(devices[1].communication);
            }
        });
        it(`should be able to return 2 devices filtered by devId`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][devId][0]=${devices[0].devId}&filter[0][devId][1]=${devices[1].devId}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
        });
        it(`should be able to return all 3 devices filtered by devId`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][devId][0]=${devices[0].devId}&filter[0][devId][1]=${devices[1].devId}&filter[0][devId][2]=${mockDevicesStub.devId}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return all 3 devices for sort (type) descending`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&sort[type]=-1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return all 3 devices for sort (type) growing`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&sort[type]=1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return all 3 devices for sort (devId) descending`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&sort[devId]=-1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
        it(`should be able to return all 3 devices for sort (devId) growing`, async () => {
            const response = await request(httpServer)
                .get(`/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
        });
    });
    describe('should be able to migrate device', () => {
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
            const mockBucketStub = (0, bucket_stub_1.bucketStub)(bucketId, (0, bucket_stub_1.bucketDtoStubs)({
                clientId: mockUcsStub.clientId.toString(),
                influxConnectionId: influxConnectionCreated.insertedId.toString(),
            }));
            const device = (0, deviceGB_stub_1.deviceGBStub)(deviceId, { bucketId });
            const deviceToChange = (0, deviceGB_stub_1.deviceGBStub)(deviceId2, {
                devId: 'teste2',
                applicationId,
            });
            const application = (0, application_stub_1.applicationStubs)(applicationId);
            await dbConnection.collection('devices').insertOne(device);
            await dbConnection.collection('devices').insertOne(deviceToChange);
            await dbConnection.collection('applications').insertOne(application);
            await dbConnection.collection('buckets').insertOne(mockBucketStub);
            const axiosPostSpy = jest.spyOn(axios_1.default, 'post');
            const dev_eui = '123456';
            const TtnServiceSpy = jest.spyOn(ttn_service_1.TtnService, 'get');
            TtnServiceSpy.mockResolvedValue({
                data: {
                    ids: { dev_eui },
                },
            });
            const response = await request(httpServer)
                .put(`/devices-gb/${deviceId}/migrate`)
                .send({
                deviceId: deviceToChange._id,
            })
                .set('Authorization', token);
            expect(TtnServiceSpy).toHaveBeenNthCalledWith(1, `applications/${application.appId}/devices/${deviceToChange.devId}`);
            expect(axiosPostSpy).toHaveBeenNthCalledWith(1, `${influxConnectionStub.host}/api/v2/query`, (0, queryGetAllData_1.default)({
                bucketName: mockBucketStub.name,
                devId: device.devId,
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
            const device = (0, deviceGB_stub_1.deviceGBStub)(deviceId, { bucketId });
            const deviceToChange = (0, deviceGB_stub_1.deviceGBStub)(deviceId2, {
                devId: 'teste2',
                applicationId,
            });
            const mockBucketStub = (0, bucket_stub_1.bucketStub)(bucketId, (0, bucket_stub_1.bucketDtoStubs)({
                clientId: mockUcsStub.clientId.toString(),
                influxConnectionId: influxConnectionCreated.insertedId.toString(),
            }));
            const application = (0, application_stub_1.applicationStubs)(applicationId);
            await dbConnection
                .collection('clients')
                .insertOne((0, clientDTO_stub_1.clientStub)(mockUcsStub.clientId.toString()));
            await dbConnection.collection('ucs').insertOne(mockUcsStub);
            await dbConnection.collection('devices').insertOne(device);
            await dbConnection.collection('devices').insertOne(deviceToChange);
            await dbConnection.collection('applications').insertOne(application);
            await dbConnection.collection('buckets').insertOne(mockBucketStub);
            const axiosPostSpy = jest.spyOn(axios_1.default, 'post');
            const dev_eui = '123456';
            const TtnServiceSpy = jest.spyOn(ttn_service_1.TtnService, 'get');
            TtnServiceSpy.mockResolvedValue({
                data: {
                    ids: { dev_eui },
                },
            });
            const response = await request(httpServer)
                .put(`/devices-gb/${device._id}/migrate`)
                .send({
                deviceId: deviceToChange._id,
                deleteData: true,
            })
                .set('Authorization', token);
            expect(TtnServiceSpy).toHaveBeenNthCalledWith(1, `applications/${application.appId}/devices/${deviceToChange.devId}`);
            expect(axiosPostSpy).toHaveBeenNthCalledWith(1, `${influxConnectionStub.host}/api/v2/query`, (0, queryGetAllData_1.default)({
                bucketName: mockBucketStub.name,
                devId: device.devId,
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
                predicate: `"dev_id" = "${device.devId}"`,
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
            TtnServiceSpy.mockRestore();
        });
        afterEach(async () => {
            await dbConnection.collection('ucs').deleteMany({});
            await dbConnection.collection('clients').deleteMany({});
            await dbConnection.collection('devices').deleteMany({});
            await dbConnection.collection('buckets').deleteMany({});
            await dbConnection.collection('influxconnections').deleteMany({});
            await dbConnection.collection('offlinealertjobs').deleteMany({});
            await dbConnection.collection('applications').deleteMany({});
        });
    });
    describe(`User Role - Commercial`, () => {
        let token;
        const userDTO = {
            ...(0, userDTOStub_1.userDTOStub)(),
            accessLevel: Role_1.Role.ADMIN,
            username: 'devices-gb@commercial.com.br',
        };
        const parentId = userDTO.clientId;
        beforeAll(async () => {
            const createUserDto = userDTO;
            await userService.create(createUserDto);
            responseAuthenticate = await request(httpServer).post('/login').send({
                username: createUserDto.username,
                password: createUserDto.password,
            });
            token = `Bearer ${responseAuthenticate.body.access_token}`;
        });
        const createDevicesAndClients = async () => {
            const devicesGB = [];
            for (let i = 0; i < 5; i++) {
                devicesGB.push({
                    ...(0, deviceGB_stub_1.deviceGBStub)(new mongoose_1.default.Types.ObjectId().toString(), {}),
                    clientId: new mongoose_1.default.Types.ObjectId(),
                    devId: new mongoose_1.default.Types.ObjectId().toString(),
                });
            }
            const parentDevice = {
                ...(0, deviceGB_stub_1.deviceGBStub)(new mongoose_1.default.Types.ObjectId().toString(), {}),
                clientId: new mongoose_1.default.Types.ObjectId(userDTO.clientId),
                devId: new mongoose_1.default.Types.ObjectId().toString(),
            };
            devicesGB.push(parentDevice);
            const childClientId = new mongoose_1.default.Types.ObjectId().toString();
            const mockClientSonStub = {
                ...(0, clientDTO_stub_1.clientStub)(childClientId),
                parentId: new mongoose_1.default.Types.ObjectId(userDTO.clientId),
            };
            const mockClientParentStub = {
                ...(0, clientDTO_stub_1.clientStub)(userDTO.clientId),
                cnpj: '123456',
                parentId: null,
            };
            const childDevice = {
                ...(0, deviceGB_stub_1.deviceGBStub)(new mongoose_1.default.Types.ObjectId().toString(), {}),
                clientId: new mongoose_1.default.Types.ObjectId(childClientId),
                devId: new mongoose_1.default.Types.ObjectId().toString(),
            };
            devicesGB.push(childDevice);
            const clients = [mockClientSonStub, mockClientParentStub];
            const clientIds = clients.map((client) => client._id.toString());
            await dbConnection.collection('clients').insertMany(clients);
            await dbConnection.collection('devices').insertMany(devicesGB);
            return { devicesGB, clientIds, parentDevice, childDevice };
        };
        it('Get All - Should be an array with length 2', async () => {
            await createDevicesAndClients();
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)('/devices-gb'))
                .set('Authorization', token);
            expect(response.body.data).toHaveLength(2);
        });
        it('Get All - Should be an array with the complete devices-gb data', async () => {
            const { clientIds } = await createDevicesAndClients();
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)('/devices-gb'))
                .set('Authorization', token);
            expect(response.body.data).toHaveLength(2);
            for (const devices of response.body.data) {
                expect(typeof devices._id).toBe('string');
                expect(typeof devices.clientId._id).toBe('string');
                expect(clientIds.includes(devices.clientId._id)).toBe(true);
            }
        });
        it(`should be able to return all 1 devices filtered by parent device devId`, async () => {
            const { parentDevice } = await createDevicesAndClients();
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)(`/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][devId][0]=${parentDevice.devId}`))
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
        });
        it(`should be able to return all 1 devices filtered by child device devId`, async () => {
            const { childDevice } = await createDevicesAndClients();
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)(`/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][devId][0]=${childDevice.devId}`))
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
        });
        afterEach(async () => {
            await dbConnection.collection('devices').deleteMany({});
            await dbConnection.collection('clients').deleteMany({});
            await dbConnection.collection('users').deleteOne({
                username: userDTO.username,
            });
        });
    });
    afterAll(async () => {
        await dbConnection
            .collection('users')
            .deleteOne({ username: (0, userDTOStub_1.userDTOStub)().username });
        await dbConnection.collection('clients').deleteMany({});
        await dbConnection.collection('devices').deleteMany({});
        await dbConnection.collection('influxconnections').deleteMany({});
        await dbConnection.collection('offlinealertjobs').deleteMany({});
        await dbConnection.collection('applications').deleteMany({});
        await app.close();
    });
});
//# sourceMappingURL=devices-gb.e2e-spec.js.map