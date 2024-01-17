"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const mongoose_1 = require("mongoose");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const transformerAggregateStub_1 = require("../../stubs/transformerAggregateStub");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
const clientDTO_stub_1 = require("../../stubs/clientDTO.stub");
const settings_stub_1 = require("../../stubs/settings.stub");
const Role_1 = require("../../../auth/models/Role");
const devices_tr_stub_1 = require("../../stubs/devices-tr.stub");
const utils_1 = require("../../../utils/utils");
const utils_2 = require("../../../utils/utils");
describe('Transformers', () => {
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
    describe(`should be able to return transformers using filtering`, () => {
        const transformers = [];
        const its = [];
        const mockTransformersStub = (0, transformerAggregateStub_1.transformersAggregateStub)();
        const mockClientStub = (0, clientDTO_stub_1.clientStub)(mockTransformersStub.clientId);
        beforeAll(async () => {
            for (let i = 0; i < 3; i++) {
                its.push(`it${i}`);
            }
            for (let i = 0; i < 2; i++) {
                transformers.push({
                    ...mockTransformersStub,
                    _id: new mongoose_1.Types.ObjectId(),
                    it: its[i],
                });
            }
            transformers.push({
                serieNumber: '123456',
                tapLevel: 3,
                tap: 4,
                feeder: 'Feeder 1',
                city: 'City 1',
                loadLimit: 100,
                overloadTimeLimit: 60,
                nominalValue_i: 200,
                location: {
                    type: 'Point',
                    coordinates: [50.12345, -20.98765],
                },
                clientId,
                _id: new mongoose_1.Types.ObjectId(),
                it: `it${new mongoose_1.Types.ObjectId().toString()}`,
            });
            await dbConnection.collection('transformers').insertMany(transformers);
            await dbConnection.collection('clients').insertOne(mockClientStub);
            await dbConnection.collection('clients').insertOne({
                name: '0000',
                address: 'Testing Address',
                cnpj: '11111',
                initials: '1111',
                local: '111',
                modules: ['test'],
                _id: clientId,
                it: its[2] || new mongoose_1.Types.ObjectId(),
            });
            const mockSettingStub = (0, settings_stub_1.settingsStub)({
                _id: new mongoose_1.Types.ObjectId(),
                clientId: mockTransformersStub.clientId,
            });
            await dbConnection.collection('settings').insertOne(mockSettingStub);
        });
        it(`should be able to return all (1) transformers filtered by 'clientId'`, async () => {
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)(`/transformers?skip=0&limit=10&clientId=${clientId.toString()}&fieldMask[clientId]=1,fieldMask[it]=1&fieldMask[feeder]=1&fieldMask[city]=1`))
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const transformer of response.body.data) {
                expect(transformer.clientId._id).toEqual(clientId.toString());
            }
        });
        it(`should be able to return all (2) transformers filtered by 'clientId.name' using filter`, async () => {
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)(`/transformers?skip=0&limit=10&filter[0][clientId.name]=${mockClientStub.name}`))
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            for (const transformer of response.body.data) {
                expect(transformer.clientId.name).toEqual(mockClientStub.name);
            }
        });
        it(`should be able to return all (2) transformers filtered by 'clientId.name' case-insensitive using filter`, async () => {
            const mockClientName = (0, utils_2.transformAndInvertCase)((0, clientDTO_stub_1.clientStub)(mockTransformersStub.clientId).name);
            const response = await request(httpServer)
                .get(`/transformers?skip=0&limit=10&filter[0][clientId.name]=${mockClientName}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            for (const transformer of response.body.data) {
                expect(transformer.clientId.name).toEqual(mockClientStub.name);
            }
        });
        it(`should be able to return all (2) transformers filtered by 'it' & 'clientId' using filter`, async () => {
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)(`/transformers?skip=0&limit=10&filter[0][clientId.name]=${mockClientStub.name}&filter[1][it][0]=${its[0]}&filter[1][it][1]=${its[1]}`))
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            for (const transformer of response.body.data) {
                expect(transformer.clientId.name).toEqual(mockClientStub.name);
                expect(transformer.it === its[0] || transformer.it === its[1]).toBeTruthy();
            }
        });
        it(`should be able to return all (2) transformers filtered by 'clientId._id' using filter`, async () => {
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)(`/transformers?skip=0&limit=10&filter[0][clientId._id][0]=${mockClientStub._id}`))
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            for (const transformer of response.body.data) {
                expect(transformer.clientId.name).toEqual(mockClientStub.name);
                expect(transformer.it === its[0] || transformer.it === its[1]).toBeTruthy();
            }
        });
        it(`should be able to return all (1) transformers filtered by 'searchText' equal to the it`, async () => {
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)(`/transformers?skip=0&limit=10&searchText=${its[0]}`))
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const transformer of response.body.data) {
                expect(transformer.clientId.name).toEqual(mockClientStub.name);
                expect(transformer.it === its[0]).toBeTruthy();
            }
        });
        it(`should be able to return all (1) transformers filtered by 'searchText' equal to the it case-insensitive`, async () => {
            const mockIts = (0, utils_2.transformAndInvertCase)(its[0]);
            const response = await request(httpServer)
                .get(`/transformers?skip=0&limit=10&searchText=${mockIts}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const transformer of response.body.data) {
                expect(transformer.clientId.name).toEqual(mockClientStub.name);
                expect(transformer.it === its[0]).toBeTruthy();
            }
        });
        it(`should be able to return all (2) transformers filtered by 'searchText' equal to the client name`, async () => {
            const response = await request(httpServer)
                .get(`/transformers?skip=0&limit=10&searchText=${mockClientStub.name}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            for (const transformer of response.body.data) {
                expect(transformer.clientId.name).toEqual(mockClientStub.name);
            }
        });
        it(`should be able to return all (2) transformers filtered by 'searchText' equal to the client name case-insensitive`, async () => {
            const mockClientName = (0, utils_2.transformAndInvertCase)((0, clientDTO_stub_1.clientStub)(mockTransformersStub.clientId).name);
            const response = await request(httpServer)
                .get(`/transformers?skip=0&limit=10&searchText=${mockClientName}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(2);
            for (const transformer of response.body.data) {
                expect(transformer.clientId.name).toEqual(mockClientStub.name);
            }
        });
        it(`should be able to return all (3) transformers filtered by 'city' using filter`, async () => {
            const cityName = mockTransformersStub.city;
            const response = await request(httpServer)
                .get(`/transformers?skip=0&limit=10&filter[0][city]=${cityName}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
            for (const transformer of response.body.data) {
                expect(transformer.city).toEqual(mockTransformersStub.city);
            }
        });
        it(`should be able to return all (3) transformers filtered by 'city' case-insensitive using filter`, async () => {
            const cityName = (0, utils_2.transformAndInvertCase)(mockTransformersStub.city);
            const response = await request(httpServer)
                .get(`/transformers?skip=0&limit=10&filter[0][city]=${cityName}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
            for (const transformer of response.body.data) {
                expect(transformer.city).toEqual(mockTransformersStub.city);
            }
        });
        it(`should be able to return all (1) transformers filtered by 'city' & 'it' case-insensitive using filter`, async () => {
            const cityName = (0, utils_2.transformAndInvertCase)(mockTransformersStub.city);
            const response = await request(httpServer)
                .get(`/transformers?skip=0&limit=10&filter[0][city]=${cityName}&filter[1][it]=${its[0]}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const transformer of response.body.data) {
                expect(transformer.city).toEqual(mockTransformersStub.city);
                expect(transformer.it === its[0]).toBeTruthy();
            }
        });
        it(`should be able to return all (1) transformers filtered by 'city' case-insensitive using filter and limit 1`, async () => {
            const cityName = (0, utils_2.transformAndInvertCase)(mockTransformersStub.city);
            const response = await request(httpServer)
                .get(`/transformers?skip=0&limit=1&filter[0][city]=${cityName}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const transformer of response.body.data) {
                expect(transformer.city).toEqual(mockTransformersStub.city);
            }
        });
        it(`should be able to return all (3) transformers filtered by 'city' case-insensitive using filter`, async () => {
            const cityName = (0, utils_2.transformAndInvertCase)(mockTransformersStub.city);
            const response = await request(httpServer)
                .get(`/transformers?skip=0&limit=10&filter[0][city]=${cityName}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(3);
            for (const transformer of response.body.data) {
                expect(transformer.city).toEqual(mockTransformersStub.city);
            }
        });
        it(`should be able to return all (0) transformers filtered by 'city' case-insensitive using filter`, async () => {
            const cityName = 'Nenhuma cidade';
            const response = await request(httpServer)
                .get(`/transformers?skip=0&limit=10&filter[0][city]=${cityName}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(0);
        });
        it(`should be able to return all (0) transformers filtered by 'city' case-insensitive using filter`, async () => {
            const cityName = 'Nenhuma cidade';
            const response = await request(httpServer)
                .get(`/transformers?skip=1&limit=10&filter[0][city]=${cityName}`)
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(0);
        });
    });
    describe('Access with access level Role.VIEWER', () => {
        let token;
        beforeAll(async () => {
            const createUserDto = (0, userDTO_stub_1.userDTOStub)();
            const username = 'role.viewer';
            await userService.create({
                ...createUserDto,
                username,
                clientId: clientId.toString(),
                accessLevel: Role_1.Role.VIEWER,
            });
            responseAuthenticate = await request(httpServer).post('/login').send({
                username,
                password: createUserDto.password,
            });
            token = `Bearer ${responseAuthenticate.body.access_token}`;
        });
        it(`should be able to return all transformers like frontend expected`, async () => {
            const mockTransformersStub = (0, transformerAggregateStub_1.transformersAggregateStub)();
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)('/transformers?skip=0&limit=10&sort[it]=1&searchText='))
                .set('Authorization', token);
            delete mockTransformersStub.nominalValue_i;
            delete mockTransformersStub.overloadTimeLimit;
            delete mockTransformersStub.loadLimit;
            delete mockTransformersStub.clientId;
            expect(response.status).toBe(200);
            expect(response.body.data[0]).toMatchObject({
                ...mockTransformersStub,
                _id: expect.any(String),
                it: expect.any(String),
            });
        });
        it(`should return transformers filtered by 'clientId._id' for Role.VIEWER`, async () => {
            const currentUser = {
                clientId: clientId.toString(),
            };
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)('/transformers?skip=0&limit=10&sort[it]=1&searchText='))
                .set('Authorization', token);
            expect(response.body.data.length).toEqual(1);
            for (const transformer of response.body.data) {
                expect(transformer.clientId._id).toEqual(currentUser.clientId);
            }
        });
    });
    describe('Access with access level MANAGER', () => {
        let token;
        beforeAll(async () => {
            const createUserDto = (0, userDTO_stub_1.userDTOStub)();
            const username = 'role.manager';
            await userService.create({
                ...createUserDto,
                username,
                clientId: clientId.toString(),
                accessLevel: Role_1.Role.MANAGER,
            });
            responseAuthenticate = await request(httpServer).post('/login').send({
                username,
                password: createUserDto.password,
            });
            token = `Bearer ${responseAuthenticate.body.access_token}`;
        });
        it(`should be able to return all transformers like frontend expected`, async () => {
            const mockTransformersStub = (0, transformerAggregateStub_1.transformersAggregateStub)();
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)('/transformers?skip=0&limit=10&sort[it]=1&searchText='))
                .set('Authorization', token);
            delete mockTransformersStub.nominalValue_i;
            delete mockTransformersStub.overloadTimeLimit;
            delete mockTransformersStub.loadLimit;
            delete mockTransformersStub.clientId;
            expect(response.status).toBe(200);
            expect(response.body.data[0]).toMatchObject({
                ...mockTransformersStub,
                _id: expect.any(String),
                it: expect.any(String),
            });
        });
        it(`should return transformers filtered by 'clientId._id' for Role.MANAGER`, async () => {
            const currentUser = {
                clientId: clientId.toString(),
            };
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)('/transformers?skip=0&limit=10&sort[it]=1&searchText='))
                .set('Authorization', token);
            expect(response.body.data.length).toEqual(1);
            for (const transformer of response.body.data) {
                expect(transformer.clientId._id).toEqual(currentUser.clientId);
            }
        });
    });
    describe('Access with access level ADMIN', () => {
        let token;
        beforeAll(async () => {
            const createUserDto = (0, userDTO_stub_1.userDTOStub)();
            const username = 'role.admin';
            await userService.create({
                ...createUserDto,
                clientId: clientId.toString(),
                username,
                accessLevel: Role_1.Role.SUPER_ADMIN,
            });
            responseAuthenticate = await request(httpServer).post('/login').send({
                username,
                password: createUserDto.password,
            });
            token = `Bearer ${responseAuthenticate.body.access_token}`;
        });
        it(`should return transformers filtered for Role.SUPER_ADMIN`, async () => {
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)('/transformers'))
                .set('Authorization', token);
            expect(response.body.data.length).toEqual(3);
        });
    });
    describe('Access with access level Role.SUPPORT', () => {
        let token;
        beforeAll(async () => {
            const createUserDto = (0, userDTO_stub_1.userDTOStub)();
            const username = 'role.support';
            await userService.create({
                ...createUserDto,
                username,
                accessLevel: Role_1.Role.SUPPORT,
            });
            responseAuthenticate = await request(httpServer).post('/login').send({
                username,
                password: createUserDto.password,
            });
            token = `Bearer ${responseAuthenticate.body.access_token}`;
        });
        it(`should return transformers filtered for Role.SUPPORT`, async () => {
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)('/transformers'))
                .set('Authorization', token);
            expect(response.body.data.length).toEqual(3);
        });
    });
    describe(`User Role - Commercial`, () => {
        let token;
        const userDTO = {
            ...(0, userDTO_stub_1.userDTOStub)(),
            accessLevel: Role_1.Role.ADMIN,
            username: 'transformers@commercial.com.br',
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
        const createTransformersAndClients = async () => {
            const mockTransformersStub = (0, transformerAggregateStub_1.transformersAggregateStub)();
            const transformers = [];
            for (let i = 0; i < 5; i++) {
                transformers.push({
                    ...mockTransformersStub,
                    _id: new mongoose_1.Types.ObjectId(),
                    it: new mongoose_1.Types.ObjectId().toString(),
                    clientId: new mongoose_1.Types.ObjectId(),
                });
            }
            const parentTransformer = {
                ...mockTransformersStub,
                _id: new mongoose_1.Types.ObjectId(),
                clientId: new mongoose_1.Types.ObjectId(parentId),
                it: new mongoose_1.Types.ObjectId().toString(),
            };
            transformers.push(parentTransformer);
            const childClientId = new mongoose_1.Types.ObjectId().toString();
            const mockChildClient = {
                ...(0, clientDTO_stub_1.clientStub)(childClientId),
                parentId: new mongoose_1.Types.ObjectId(parentId),
            };
            const mockParentClient = {
                ...(0, clientDTO_stub_1.clientStub)(parentId),
                cnpj: '123456',
                parentId: null,
            };
            const childTransformer = {
                ...mockTransformersStub,
                _id: new mongoose_1.Types.ObjectId(),
                clientId: new mongoose_1.Types.ObjectId(childClientId),
                it: new mongoose_1.Types.ObjectId().toString(),
            };
            transformers.push(childTransformer);
            const clients = [mockChildClient, mockParentClient];
            await dbConnection.collection('clients').insertMany(clients);
            await dbConnection.collection('transformers').insertMany(transformers);
            const clientIds = clients.map((client) => client._id.toString());
            return {
                transformers,
                clientIds,
                parentTransformer,
                childTransformer,
            };
        };
        it('Get All - Should be an array with length 2', async () => {
            await createTransformersAndClients();
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)('/transformers'))
                .set('Authorization', token);
            expect(response.body.data).toHaveLength(2);
        });
        it('Get All - Should be an array with the complete transformers data', async () => {
            const { clientIds } = await createTransformersAndClients();
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)('/transformers'))
                .set('Authorization', token);
            expect(response.body.data).toHaveLength(2);
            for (const transformers of response.body.data) {
                expect(typeof transformers._id).toBe('string');
                expect(typeof transformers.clientId._id).toBe('string');
                expect(clientIds.includes(transformers.clientId._id)).toBe(true);
            }
        });
        it(`should be able to return all (0) transformers filtered by 'clientId'`, async () => {
            const { transformers } = await createTransformersAndClients();
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)(`/transformers?skip=0&limit=10&clientId=${transformers[0].clientId.toString()}&fieldMask[clientId]=1,fieldMask[it]=1&fieldMask[feeder]=1&fieldMask[city]=1`))
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(0);
        });
        it(`should be able to return all (1) transformers filtered by 'clientId'`, async () => {
            const { childTransformer } = await createTransformersAndClients();
            const response = await request(httpServer)
                .get((0, utils_1.generateRandomQueryParams)(`/transformers?skip=0&limit=10&clientId=${childTransformer.clientId.toString()}&fieldMask[clientId]=1,fieldMask[it]=1&fieldMask[feeder]=1&fieldMask[city]=1`))
                .set('Authorization', token);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toEqual(1);
            for (const transformer of response.body.data) {
                expect(transformer.clientId._id).toEqual(childTransformer.clientId.toString());
            }
        });
        afterEach(async () => {
            await dbConnection.collection('transformers').deleteMany({});
            await dbConnection.collection('clients').deleteMany({});
            await dbConnection.collection('settings').deleteMany({});
            await dbConnection.collection('users').deleteOne({
                username: userDTO.username,
            });
        });
    });
    it(`should be able to return all transformers like frontend expected`, async () => {
        const mockTransformersStub = (0, transformerAggregateStub_1.transformersAggregateStub)();
        await dbConnection.collection('transformers').insertOne({
            ...mockTransformersStub,
            _id: new mongoose_1.Types.ObjectId(),
            it: new mongoose_1.Types.ObjectId().toString(),
            smartTrafoDeviceId: new mongoose_1.Types.ObjectId(),
        });
        const response = await request(httpServer)
            .get((0, utils_1.generateRandomQueryParams)('/transformers?skip=0&limit=10&sort[it]=1&searchText='))
            .set('Authorization', token);
        delete mockTransformersStub.nominalValue_i;
        delete mockTransformersStub.overloadTimeLimit;
        delete mockTransformersStub.loadLimit;
        delete mockTransformersStub.clientId;
        expect(response.status).toBe(200);
        expect(response.body.data[0]).toMatchObject({
            ...mockTransformersStub,
            _id: expect.any(String),
            it: expect.any(String),
        });
    });
    it(`should be able to return all devices (0) of transformers`, async () => {
        const response = await request(httpServer)
            .get((0, utils_1.generateRandomQueryParams)('/transformers/devices'))
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect(response.body.pageInfo.count === 0).toBeTruthy();
    });
    it(`should be to able to return all (1) devices of transformers`, async () => {
        const mockTransformersStub = (0, transformerAggregateStub_1.transformersAggregateStub)();
        const clientId = new mongoose_1.Types.ObjectId();
        const mockDeviceTrStub = (0, devices_tr_stub_1.deviceTrStub)({ clientId });
        await dbConnection
            .collection('smarttrafodevices')
            .insertOne(mockDeviceTrStub);
        const client = {
            ...(0, clientDTO_stub_1.clientStub)(clientId.toString()),
        };
        await dbConnection.collection('clients').insertOne(client);
        await dbConnection.collection('transformers').insertOne({
            ...mockTransformersStub,
            clientId,
            _id: new mongoose_1.Types.ObjectId(),
            it: new mongoose_1.Types.ObjectId().toString(),
            smartTrafoDeviceId: mockDeviceTrStub._id,
        });
        const response = await request(httpServer)
            .get((0, utils_1.generateRandomQueryParams)(`/transformers/devices?clientId=${clientId}`))
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect(response.body.data.length).toBe(1);
        expect(response.body.pageInfo.count === 1).toBeTruthy();
    });
    afterAll(async () => {
        await dbConnection.collection('users').deleteMany({});
        await dbConnection.collection('transformers').deleteMany({});
        await dbConnection.collection('clients').deleteMany({});
        await dbConnection.collection('smarttrafodevices').deleteMany({});
        await dbConnection.collection('settings').deleteMany({});
        await app.close();
    });
});
//# sourceMappingURL=transformers.e2e-spec.js.map