import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import MockAdapter from 'axios-mock-adapter';
import { Connection, Types } from 'mongoose';
import * as request from 'supertest';

import { AppModule } from 'src/app.module';
import { Role } from 'src/auth/models/Role';
import { DatabaseService } from 'src/common/database/database.service';
import { TtnService } from 'src/common/services/ttn.service';
import { buildGatewayStub } from 'src/gateways/stubs/gateway.stub';
import { findFilteredGatewaysResponseStub } from 'src/gateways/stubs/gatewayFilteredClient.stub';
import { findOneResponseStub } from 'src/gateways/stubs/gatewayFindOne.stub';
import { userDTOStub } from 'src/gateways/stubs/userDTO.stub';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { generateRandomQueryParams } from 'src/utils/utils';
import { Client } from 'src/clients/entities/client.entity';
import { range } from 'src/utils/range';
import { clientStub } from 'src/gateways/stubs/clientDTO.stub';

type BuildClientStubsProps = {
  firstClientId: string;
  numberOfClients: number;
  numberOfChildrens?: number;
};

export function buildClientStubs({
  firstClientId,
  numberOfClients,
  numberOfChildrens,
}: BuildClientStubsProps) {
  const clients: Client[] = [];
  const childrens: Client[] = [];

  range(numberOfClients).forEach((_, index) => {
    clients.push(
      clientStub(
        new Types.ObjectId(index === 0 ? firstClientId : undefined).toString(),
      ),
    );
  });

  if (numberOfChildrens) {
    range(numberOfChildrens).forEach(() => {
      childrens.push(
        clientStub(new Types.ObjectId().toString(), {
          parentId: clients[0]._id,
        }),
      );
    });
  }

  return [...clients, ...childrens];
}

describe('Gateways', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let userService: UsersService;
  let responseAuthenticate: request.Response;
  let token: string;
  let axiosMock: MockAdapter;

  beforeAll(async () => {
    axiosMock = new MockAdapter(TtnService);
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

  afterEach(async () => {
    await dbConnection.collection('gateways').deleteMany({});
  });

  it(`should be able to return all gateways`, async () => {
    const clientId = new Types.ObjectId();
    const clients = buildClientStubs({
      firstClientId: clientId.toString(),
      numberOfClients: 2,
    });

    await dbConnection.collection('clients').insertMany(clients);

    const gatewayStubMock = buildGatewayStub({
      numberOfGateways: 1,
      clients,
    });

    const gatewayStub = gatewayStubMock[0];

    await dbConnection.collection('gateways').insertOne(gatewayStub);

    axiosMock
      .onGet('gs/gateways/gateway_id/connection/stats')
      .reply(200, { data: { last_status_received_at: '2023-09-04' } });

    axiosMock
      .onGet(
        'gateways?field_mask=name,description,frequency_plan_ids,gateway_server_address',
      )
      .reply(200, { gateways: [gatewayStub] });

    const response = await request(httpServer)
      .get('/gateways')
      .set('Authorization', token);

    const gatewaysStubsIds = [gatewayStub.ids.gateway_id];
    const responseIds = response.body.map(({ ttnId }) => ttnId);

    expect(response.status).toBe(200);
    expect(responseIds).toStrictEqual(gatewaysStubsIds);
  });

  it(`should be able to return a gateways by id`, async () => {
    const mockGatewayStubFromTtn = findOneResponseStub;
    await dbConnection.collection('gateways').insertOne(mockGatewayStubFromTtn);
    const ttnId = 'poiuytrewq';
    axiosMock
      .onGet(`gateways/${ttnId}?field_mask=name,description`)
      .reply(200, { name: 'bjnkml', description: 'GatewayDescription' });

    const response = await request(httpServer)
      .get(`/gateways/ttn/${ttnId}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
  });

  it(`should be able to return a gateways for clientId`, async () => {
    const mockGatewayStubFromTtn = findOneResponseStub;
    await dbConnection.collection('gateways').insertOne(mockGatewayStubFromTtn);

    axiosMock
      .onGet('gateways?field_mask=name,description')
      .reply(200, { gateways: findFilteredGatewaysResponseStub });

    const clientId = '64de077bd89e32004e59fb37';
    const response = await request(httpServer)
      .get(`/gateways/filterByClients?clientId=${clientId}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
  });

  it('should be able to update a gateway', async () => {
    const mockGatewayStubFromTtn = findOneResponseStub;
    const mockGatewayStubUpdate = {
      ...mockGatewayStubFromTtn,
      clientId: ['64de077bd89e32004e59fb37'],
    };

    await dbConnection.collection('gateways').insertOne(mockGatewayStubFromTtn);

    const response = await request(httpServer)
      .post(`/gateways/${mockGatewayStubFromTtn.ttnId}/link`)
      .send(mockGatewayStubUpdate)
      .set('Authorization', token);

    expect(response.status).toBe(201);
    expect(response.body.clientId).toEqual(mockGatewayStubUpdate.clientId);
  });

  it('should return an error when updating a gateway with invalid clientId', async () => {
    const mockGatewayStubFromTtn = findOneResponseStub;
    const mockGatewayStubUpdate = {
      ...mockGatewayStubFromTtn,
      clientId: 33333,
    };

    await dbConnection.collection('gateways').insertOne(mockGatewayStubFromTtn);

    const response = await request(httpServer)
      .post(`/gateways/${mockGatewayStubFromTtn.ttnId}/link`)
      .send(mockGatewayStubUpdate)
      .set('Authorization', token);

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual(
      'Ocorreu um erro ao atualizar o gateway.',
    );
  });

  afterEach(async () => {
    await dbConnection.collection('gateways').deleteMany({});
  });

  afterAll(async () => {
    await dbConnection
      .collection('users')
      .deleteOne({ username: userDTOStub().username });

    await dbConnection.collection('clients').deleteMany({});

    await app.close();
  });

  describe('AccessLevel SUPER_ADMIN', () => {
    let accessToken: string;
    const username = 'Role.SUPER_ADMIN';
    const createUserDto: CreateUserDto = userDTOStub();

    beforeAll(async () => {
      await userService.create({
        ...createUserDto,
        username,
        accessLevel: Role.SUPER_ADMIN,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      accessToken = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should be able to return all gateways`, async () => {
      const clients = buildClientStubs({
        firstClientId: createUserDto.clientId,
        numberOfClients: 5,
        numberOfChildrens: 5,
      });
      const gatewayStubs = buildGatewayStub({ clients, numberOfGateways: 5 });

      await dbConnection.collection('clients').insertMany(clients);
      await dbConnection.collection('gateways').insertMany(gatewayStubs);

      axiosMock
        .onGet('gs/gateways/gateway_id/connection/stats')
        .reply(200, { data: { last_status_received_at: '2023-09-04' } });

      axiosMock
        .onGet(
          `gateways?field_mask=name,description,frequency_plan_ids,gateway_server_address`,
        )
        .reply(200, { gateways: gatewayStubs });

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/gateways'))
        .set('Authorization', accessToken);

      const gatewaysStubsIds = gatewayStubs.map(({ ttnId }) => ttnId);
      const responseIds = response.body.map(({ ttnId }) => ttnId);

      expect(response.status).toBe(200);
      expect(responseIds).toStrictEqual(gatewaysStubsIds);
    });

    afterEach(async () => {
      await dbConnection.collection('clients').deleteMany({});

      await dbConnection.collection('gateways').deleteMany({});
    });

    afterAll(async () => {
      await dbConnection.collection('users').deleteOne({ username });
    });
  });

  describe('AccessLevel COMMERCIAL', () => {
    let accessToken: string;
    const username = 'Role.ADMIN';
    const createUserDto: CreateUserDto = userDTOStub();

    beforeAll(async () => {
      await userService.create({
        ...createUserDto,
        username,
        accessLevel: Role.ADMIN,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      accessToken = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should be able to return all gateways`, async () => {
      const clientId = createUserDto.clientId;
      const clients = buildClientStubs({
        firstClientId: createUserDto.clientId,
        numberOfClients: 5,
        numberOfChildrens: 5,
      });
      const gatewayStubs = buildGatewayStub({ clients, numberOfGateways: 5 });
      const filteredGateways = gatewayStubs.filter(
        (gateway) => gateway.clientId.toString() === clientId,
      );

      await dbConnection.collection('clients').insertMany(clients);
      await dbConnection.collection('gateways').insertMany(gatewayStubs);

      axiosMock
        .onGet('gs/gateways/gateway_id/connection/stats')
        .reply(200, { data: { last_status_received_at: '2023-09-04' } });

      axiosMock
        .onGet(
          `gateways?field_mask=name,description,frequency_plan_ids,gateway_server_address`,
        )
        .reply(200, { gateways: filteredGateways });

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/gateways'))
        .set('Authorization', accessToken);

      const gatewaysStubsIds = filteredGateways.map(({ ttnId }) => ttnId);
      const responseIds = response.body.map(({ ttnId }) => ttnId);

      expect(response.status).toBe(200);
      expect(responseIds).toStrictEqual(gatewaysStubsIds);
    });

    afterEach(async () => {
      await dbConnection.collection('clients').deleteMany({});

      await dbConnection.collection('gateways').deleteMany({});
    });

    afterAll(async () => {
      await dbConnection.collection('users').deleteOne({ username });
    });
  });

  describe('AccessLevel SUPPORT', () => {
    let accessToken: string;
    const username = 'Role.SUPPORT';
    const createUserDto: CreateUserDto = userDTOStub();

    beforeAll(async () => {
      await userService.create({
        ...createUserDto,
        username,
        accessLevel: Role.SUPPORT,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      accessToken = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should be able to return all gateways`, async () => {
      const clients = buildClientStubs({
        firstClientId: createUserDto.clientId,
        numberOfClients: 5,
        numberOfChildrens: 5,
      });
      const gatewayStubs = buildGatewayStub({ clients, numberOfGateways: 5 });

      await dbConnection.collection('clients').insertMany(clients);
      await dbConnection.collection('gateways').insertMany(gatewayStubs);

      axiosMock
        .onGet('gs/gateways/gateway_id/connection/stats')
        .reply(200, { data: { last_status_received_at: '2023-09-04' } });

      axiosMock
        .onGet(
          `gateways?field_mask=name,description,frequency_plan_ids,gateway_server_address`,
        )
        .reply(200, { gateways: gatewayStubs });

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/gateways'))
        .set('Authorization', accessToken);

      const gatewaysStubsIds = gatewayStubs.map(({ ttnId }) => ttnId);
      const responseIds = response.body.map(({ ttnId }) => ttnId);

      expect(response.status).toBe(200);
      expect(responseIds).toStrictEqual(gatewaysStubsIds);
    });

    afterEach(async () => {
      await dbConnection.collection('clients').deleteMany({});

      await dbConnection.collection('gateways').deleteMany({});
    });

    afterAll(async () => {
      await dbConnection.collection('users').deleteOne({ username });
    });
  });

  describe('AccessLevel MANAGER', () => {
    let accessToken: string;
    const username = 'Role.MANAGER';
    const createUserDto: CreateUserDto = userDTOStub();

    beforeAll(async () => {
      await userService.create({
        ...createUserDto,
        username,
        accessLevel: Role.MANAGER,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      accessToken = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should be able to return all gateways`, async () => {
      const clientId = createUserDto.clientId;
      const clients = buildClientStubs({
        firstClientId: clientId,
        numberOfClients: 5,
        numberOfChildrens: 5,
      });
      const gatewayStubs = buildGatewayStub({ clients, numberOfGateways: 5 });
      const filteredGateways = gatewayStubs.filter(
        (gateway) => gateway.clientId[0]._id.toString() === clientId,
      );

      await dbConnection.collection('clients').insertMany(clients);
      await dbConnection.collection('gateways').insertMany(gatewayStubs);

      axiosMock
        .onGet('gs/gateways/gateway_id/connection/stats')
        .reply(200, { data: { last_status_received_at: '2023-09-04' } });

      axiosMock
        .onGet(
          `gateways?field_mask=name,description,frequency_plan_ids,gateway_server_address`,
        )
        .reply(200, { gateways: filteredGateways });

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/gateways'))
        .set('Authorization', accessToken);

      const gatewaysStubsIds = filteredGateways.map(({ ttnId }) => ttnId);
      const responseIds = response.body.map(({ ttnId }) => ttnId);

      expect(response.status).toBe(200);
      expect(responseIds).toStrictEqual(gatewaysStubsIds);
    });

    afterEach(async () => {
      await dbConnection.collection('clients').deleteMany({});

      await dbConnection.collection('gateways').deleteMany({});
    });

    afterAll(async () => {
      await dbConnection.collection('users').deleteOne({ username });
    });
  });

  describe('AccessLevel VIEWER', () => {
    let accessToken: string;
    const username = 'Role.VIEWER';
    const createUserDto: CreateUserDto = userDTOStub();

    beforeAll(async () => {
      await userService.create({
        ...createUserDto,
        username,
        accessLevel: Role.VIEWER,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      accessToken = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should be able to return all gateways`, async () => {
      const clientId = createUserDto.clientId;
      const clients = buildClientStubs({
        firstClientId: clientId,
        numberOfClients: 5,
        numberOfChildrens: 5,
      });
      const gatewayStubs = buildGatewayStub({ clients, numberOfGateways: 5 });
      const filteredGateways = gatewayStubs.filter(
        (gateway) => gateway.clientId[0]._id.toString() === clientId,
      );

      await dbConnection.collection('clients').insertMany(clients);
      await dbConnection.collection('gateways').insertMany(gatewayStubs);

      axiosMock
        .onGet('gs/gateways/gateway_id/connection/stats')
        .reply(200, { data: { last_status_received_at: '2023-09-04' } });

      axiosMock
        .onGet(
          `gateways?field_mask=name,description,frequency_plan_ids,gateway_server_address`,
        )
        .reply(200, { gateways: filteredGateways });

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/gateways'))
        .set('Authorization', accessToken);

      const gatewaysStubsIds = filteredGateways.map(({ ttnId }) => ttnId);
      const responseIds = response.body.map(({ ttnId }) => ttnId);

      expect(response.status).toBe(200);
      expect(responseIds).toStrictEqual(gatewaysStubsIds);
    });

    afterEach(async () => {
      await dbConnection.collection('clients').deleteMany({});

      await dbConnection.collection('gateways').deleteMany({});
    });

    afterAll(async () => {
      await dbConnection.collection('users').deleteOne({ username });
    });
  });
});
