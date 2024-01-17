import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { transformersAggregateStub } from 'src/transformers/stubs/transformerAggregateStub';
import { userDTOStub } from 'src/transformers/stubs/userDTO.stub';
import { clientStub } from 'src/transformers/stubs/clientDTO.stub';
import { settingsStub } from 'src/transformers/stubs/settings.stub';
import { Role } from 'src/auth/models/Role';
import { deviceTrStub } from 'src/transformers/stubs/devices-tr.stub';
import { generateRandomQueryParams } from 'src/utils/utils';
import { Client } from 'src/clients/entities/client.entity';
import { transformAndInvertCase } from 'src/utils/utils';

describe('Transformers', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let userService: UsersService;
  let responseAuthenticate: request.Response;
  let token: string;
  const clientId = new Types.ObjectId();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    userService = moduleRef.get<UsersService>(UsersService);
    httpServer = app.getHttpServer();

    const createUserDto: CreateUserDto = userDTOStub();

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
    const mockTransformersStub = transformersAggregateStub();
    const mockClientStub = clientStub(mockTransformersStub.clientId);

    beforeAll(async () => {
      for (let i = 0; i < 3; i++) {
        its.push(`it${i}`);
      }

      //Create two transformer if its and the same client name && same clientId
      for (let i = 0; i < 2; i++) {
        transformers.push({
          ...mockTransformersStub,
          _id: new Types.ObjectId(),
          it: its[i],
        });
      }

      //Create other one transformer but with other it and other client name
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
        _id: new Types.ObjectId(),
        it: `it${new Types.ObjectId().toString()}`,
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
        it: its[2] || new Types.ObjectId(),
      });

      const mockSettingStub = settingsStub({
        _id: new Types.ObjectId(),
        clientId: mockTransformersStub.clientId,
      });

      await dbConnection.collection('settings').insertOne(mockSettingStub);
    });

    it(`should be able to return all (1) transformers filtered by 'clientId'`, async () => {
      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/transformers?skip=0&limit=10&clientId=${clientId.toString()}&fieldMask[clientId]=1,fieldMask[it]=1&fieldMask[feeder]=1&fieldMask[city]=1`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(1);
      for (const transformer of response.body.data) {
        expect(transformer.clientId._id).toEqual(clientId.toString());
      }
    });

    it(`should be able to return all (2) transformers filtered by 'clientId.name' using filter`, async () => {
      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/transformers?skip=0&limit=10&filter[0][clientId.name]=${mockClientStub.name}`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
      for (const transformer of response.body.data) {
        expect(transformer.clientId.name).toEqual(mockClientStub.name);
      }
    });

    it(`should be able to return all (2) transformers filtered by 'clientId.name' case-insensitive using filter`, async () => {
      const mockClientName = transformAndInvertCase(
        clientStub(mockTransformersStub.clientId).name,
      );

      const response = await request(httpServer)
        .get(
          `/transformers?skip=0&limit=10&filter[0][clientId.name]=${mockClientName}`,
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
      for (const transformer of response.body.data) {
        expect(transformer.clientId.name).toEqual(mockClientStub.name);
      }
    });

    it(`should be able to return all (2) transformers filtered by 'it' & 'clientId' using filter`, async () => {
      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/transformers?skip=0&limit=10&filter[0][clientId.name]=${mockClientStub.name}&filter[1][it][0]=${its[0]}&filter[1][it][1]=${its[1]}`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
      for (const transformer of response.body.data) {
        expect(transformer.clientId.name).toEqual(mockClientStub.name);
        expect(
          transformer.it === its[0] || transformer.it === its[1],
        ).toBeTruthy();
      }
    });

    it(`should be able to return all (2) transformers filtered by 'clientId._id' using filter`, async () => {
      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/transformers?skip=0&limit=10&filter[0][clientId._id][0]=${mockClientStub._id}`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
      for (const transformer of response.body.data) {
        expect(transformer.clientId.name).toEqual(mockClientStub.name);
        expect(
          transformer.it === its[0] || transformer.it === its[1],
        ).toBeTruthy();
      }
    });

    it(`should be able to return all (1) transformers filtered by 'searchText' equal to the it`, async () => {
      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/transformers?skip=0&limit=10&searchText=${its[0]}`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(1);
      for (const transformer of response.body.data) {
        expect(transformer.clientId.name).toEqual(mockClientStub.name);
        expect(transformer.it === its[0]).toBeTruthy();
      }
    });

    it(`should be able to return all (1) transformers filtered by 'searchText' equal to the it case-insensitive`, async () => {
      const mockIts = transformAndInvertCase(its[0]);

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
      const mockClientName = transformAndInvertCase(
        clientStub(mockTransformersStub.clientId).name,
      );

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
      const cityName = transformAndInvertCase(mockTransformersStub.city);

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
      const cityName = transformAndInvertCase(mockTransformersStub.city);

      const response = await request(httpServer)
        .get(
          `/transformers?skip=0&limit=10&filter[0][city]=${cityName}&filter[1][it]=${its[0]}`,
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(1);
      for (const transformer of response.body.data) {
        expect(transformer.city).toEqual(mockTransformersStub.city);
        expect(transformer.it === its[0]).toBeTruthy();
      }
    });

    it(`should be able to return all (1) transformers filtered by 'city' case-insensitive using filter and limit 1`, async () => {
      const cityName = transformAndInvertCase(mockTransformersStub.city);

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
      const cityName = transformAndInvertCase(mockTransformersStub.city);

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
      const createUserDto: CreateUserDto = userDTOStub();
      const username = 'role.viewer';

      await userService.create({
        ...createUserDto,
        username,
        clientId: clientId.toString(),
        accessLevel: Role.VIEWER,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should be able to return all transformers like frontend expected`, async () => {
      const mockTransformersStub = transformersAggregateStub();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            '/transformers?skip=0&limit=10&sort[it]=1&searchText=',
          ),
        )
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
        .get(
          generateRandomQueryParams(
            '/transformers?skip=0&limit=10&sort[it]=1&searchText=',
          ),
        )
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
      const createUserDto: CreateUserDto = userDTOStub();
      const username = 'role.manager';

      await userService.create({
        ...createUserDto,
        username,
        clientId: clientId.toString(),
        accessLevel: Role.MANAGER,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should be able to return all transformers like frontend expected`, async () => {
      const mockTransformersStub = transformersAggregateStub();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            '/transformers?skip=0&limit=10&sort[it]=1&searchText=',
          ),
        )
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
        .get(
          generateRandomQueryParams(
            '/transformers?skip=0&limit=10&sort[it]=1&searchText=',
          ),
        )
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
      const createUserDto: CreateUserDto = userDTOStub();
      const username = 'role.admin';

      await userService.create({
        ...createUserDto,
        clientId: clientId.toString(),
        username,
        accessLevel: Role.SUPER_ADMIN,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should return transformers filtered for Role.SUPER_ADMIN`, async () => {
      const response = await request(httpServer)
        .get(generateRandomQueryParams('/transformers'))
        .set('Authorization', token);

      expect(response.body.data.length).toEqual(3);
    });
  });

  describe('Access with access level Role.SUPPORT', () => {
    let token;
    beforeAll(async () => {
      const createUserDto: CreateUserDto = userDTOStub();
      const username = 'role.support';

      await userService.create({
        ...createUserDto,
        username,
        accessLevel: Role.SUPPORT,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should return transformers filtered for Role.SUPPORT`, async () => {
      const response = await request(httpServer)
        .get(generateRandomQueryParams('/transformers'))
        .set('Authorization', token);

      expect(response.body.data.length).toEqual(3);
    });
  });

  describe(`User Role - Commercial`, () => {
    let token: string;
    const userDTO = {
      ...userDTOStub(),
      accessLevel: Role.ADMIN,
      username: 'transformers@commercial.com.br',
    };

    const parentId = userDTO.clientId;

    beforeAll(async () => {
      const createUserDto: CreateUserDto = userDTO;

      await userService.create(createUserDto);

      responseAuthenticate = await request(httpServer).post('/login').send({
        username: createUserDto.username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    const createTransformersAndClients = async () => {
      const mockTransformersStub = transformersAggregateStub();

      const transformers = [];

      for (let i = 0; i < 5; i++) {
        transformers.push({
          ...mockTransformersStub,
          _id: new Types.ObjectId(),
          it: new Types.ObjectId().toString(),
          clientId: new Types.ObjectId(),
        });
      }

      const parentTransformer = {
        ...mockTransformersStub,
        _id: new Types.ObjectId(),
        clientId: new Types.ObjectId(parentId),
        it: new Types.ObjectId().toString(),
      };

      transformers.push(parentTransformer);

      const childClientId = new Types.ObjectId().toString();

      const mockChildClient: Client = {
        ...clientStub(childClientId),
        parentId: new Types.ObjectId(parentId),
      };

      const mockParentClient: Client = {
        ...clientStub(parentId),
        cnpj: '123456',
        parentId: null,
      };

      const childTransformer = {
        ...mockTransformersStub,
        _id: new Types.ObjectId(),
        clientId: new Types.ObjectId(childClientId),
        it: new Types.ObjectId().toString(),
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
        .get(generateRandomQueryParams('/transformers'))
        .set('Authorization', token);

      expect(response.body.data).toHaveLength(2);
    });

    it('Get All - Should be an array with the complete transformers data', async () => {
      const { clientIds } = await createTransformersAndClients();
      const response = await request(httpServer)
        .get(generateRandomQueryParams('/transformers'))
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
        .get(
          generateRandomQueryParams(
            `/transformers?skip=0&limit=10&clientId=${transformers[0].clientId.toString()}&fieldMask[clientId]=1,fieldMask[it]=1&fieldMask[feeder]=1&fieldMask[city]=1`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(0);
    });

    it(`should be able to return all (1) transformers filtered by 'clientId'`, async () => {
      const { childTransformer } = await createTransformersAndClients();
      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/transformers?skip=0&limit=10&clientId=${childTransformer.clientId.toString()}&fieldMask[clientId]=1,fieldMask[it]=1&fieldMask[feeder]=1&fieldMask[city]=1`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(1);
      for (const transformer of response.body.data) {
        expect(transformer.clientId._id).toEqual(
          childTransformer.clientId.toString(),
        );
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
    const mockTransformersStub = transformersAggregateStub();

    await dbConnection.collection('transformers').insertOne({
      ...mockTransformersStub,
      _id: new Types.ObjectId(),
      it: new Types.ObjectId().toString(),
      smartTrafoDeviceId: new Types.ObjectId(),
    });

    const response = await request(httpServer)
      .get(
        generateRandomQueryParams(
          '/transformers?skip=0&limit=10&sort[it]=1&searchText=',
        ),
      )
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
      .get(generateRandomQueryParams('/transformers/devices'))
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBeTruthy();
    expect(response.body.pageInfo.count === 0).toBeTruthy();
  });

  it(`should be to able to return all (1) devices of transformers`, async () => {
    const mockTransformersStub = transformersAggregateStub();
    const clientId = new Types.ObjectId();

    const mockDeviceTrStub = deviceTrStub({ clientId });
    await dbConnection
      .collection('smarttrafodevices')
      .insertOne(mockDeviceTrStub);

    const client: Client = {
      ...clientStub(clientId.toString()),
    };

    await dbConnection.collection('clients').insertOne(client);

    await dbConnection.collection('transformers').insertOne({
      ...mockTransformersStub,
      clientId,
      _id: new Types.ObjectId(),
      it: new Types.ObjectId().toString(),
      smartTrafoDeviceId: mockDeviceTrStub._id,
    });

    const response = await request(httpServer)
      .get(
        generateRandomQueryParams(`/transformers/devices?clientId=${clientId}`),
      )
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
