import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { userDTOStub } from 'src/meter-change/stubs/userDTO.stub';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { meterChangeStubs } from 'src/meter-change/stubs/meter-change.stub';
import { meterChangeDtoStubs } from 'src/meter-change/stubs/meter-changeDTO.stub';
import { clientStub } from 'src/meter-change/stubs/client.stub';
import { deviceGBStub } from 'src/meter-change/stubs/deviceGB.stub';
import { Role } from 'src/auth/models/Role';

describe('MeterChange accessLevel Role.SUPER_ADMIN', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let userService: UsersService;
  let responseAuthenticate: request.Response;
  let token: string;
  const clientId = new Types.ObjectId().toString();
  const deviceId = new Types.ObjectId().toString();

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

  afterEach(async () => {
    await dbConnection.collection('meterchanges').deleteMany({});
    await dbConnection
      .collection('devices')
      .deleteOne({ _id: new Types.ObjectId(deviceId) });
    await dbConnection
      .collection('clients')
      .deleteOne({ _id: new Types.ObjectId(clientId) });
  });

  it(`should be able to return all meterChange`, async () => {
    const mockDevice = deviceGBStub(deviceId);
    const mockClient = clientStub(clientId);
    const mockMeterChangeStub = meterChangeStubs(
      meterChangeDtoStubs({ clientId, deviceId }),
    );
    await dbConnection
      .collection('meterchanges')
      .insertOne(mockMeterChangeStub);
    await dbConnection.collection('clients').insertOne(mockClient);
    await dbConnection.collection('devices').insertOne(mockDevice);

    const response = await request(httpServer)
      .get('/meter-changes')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body[0].clientId).toMatchObject(mockClient);
    expect(response.body[0].deviceId).toMatchObject(mockDevice);
    expect(response.body[0]._id).toMatch(mockMeterChangeStub._id.toString());
  });

  it(`should be able to return a meterChange by id`, async () => {
    const mockMeterChangeStub = meterChangeStubs(meterChangeDtoStubs());
    await dbConnection
      .collection('meterchanges')
      .insertOne(mockMeterChangeStub);

    const response = await request(httpServer)
      .get(`/meter-changes/${mockMeterChangeStub._id.toString()}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body._id.toString()).toEqual(
      mockMeterChangeStub._id.toString(),
    );
  });

  it('should be able to create a meterChange', async () => {
    const mockMeterChangeStub = meterChangeDtoStubs();

    const response = await request(httpServer)
      .post(`/meter-changes`)
      .send(mockMeterChangeStub)
      .set('Authorization', token);

    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
  });

  it('should be able to update a meterChange', async () => {
    const mockMeterChangeStub = meterChangeStubs(meterChangeDtoStubs());
    const mockMeterChangeStubUpdate = meterChangeDtoStubs({
      firstConsumedNewMeter: 123,
    });

    await dbConnection
      .collection('meterchanges')
      .insertOne(mockMeterChangeStub);

    const response = await request(httpServer)
      .put(`/meter-changes/${mockMeterChangeStub._id}`)
      .send(mockMeterChangeStubUpdate)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.firstConsumedNewMeter).toEqual(
      mockMeterChangeStubUpdate.firstConsumedNewMeter,
    );
  });

  it('should be able to delete a meterChange', async () => {
    const mockMeterChangeStub = meterChangeStubs(meterChangeDtoStubs());

    await dbConnection
      .collection('meterchanges')
      .insertOne(mockMeterChangeStub);

    const response = await request(httpServer)
      .delete(`/meter-changes/${mockMeterChangeStub._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await dbConnection
      .collection('users')
      .deleteOne({ username: userDTOStub().username });
    await app.close();
  });
});

describe('MeterChange accessLevel Role.MANAGER', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let userService: UsersService;
  let responseAuthenticate: request.Response;
  let token: string;
  const clientId = new Types.ObjectId().toString();
  const deviceId = new Types.ObjectId().toString();

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

    createUserDto.accessLevel = Role.MANAGER;

    await userService.create(createUserDto);

    responseAuthenticate = await request(httpServer).post('/login').send({
      username: createUserDto.username,
      password: createUserDto.password,
    });

    token = `Bearer ${responseAuthenticate.body.access_token}`;
  });

  afterEach(async () => {
    await dbConnection.collection('meterchanges').deleteMany({});
    await dbConnection
      .collection('devices')
      .deleteOne({ _id: new Types.ObjectId(deviceId) });
    await dbConnection
      .collection('clients')
      .deleteOne({ _id: new Types.ObjectId(clientId) });
  });

  it(`should be able to return all meterChange`, async () => {
    const mockDevice = deviceGBStub(deviceId);
    const mockClient = clientStub(clientId);
    const mockMeterChangeStub = meterChangeStubs(
      meterChangeDtoStubs({ clientId, deviceId }),
    );
    await dbConnection
      .collection('meterchanges')
      .insertOne(mockMeterChangeStub);
    await dbConnection.collection('clients').insertOne(mockClient);
    await dbConnection.collection('devices').insertOne(mockDevice);

    const response = await request(httpServer)
      .get('/meter-changes')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body[0].clientId).toMatchObject(mockClient);
    expect(response.body[0].deviceId).toMatchObject(mockDevice);
    expect(response.body[0]._id).toMatch(mockMeterChangeStub._id.toString());
  });

  it(`should be able to return a meterChange by id`, async () => {
    const mockMeterChangeStub = meterChangeStubs(meterChangeDtoStubs());
    await dbConnection
      .collection('meterchanges')
      .insertOne(mockMeterChangeStub);

    const response = await request(httpServer)
      .get(`/meter-changes/${mockMeterChangeStub._id.toString()}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body._id.toString()).toEqual(
      mockMeterChangeStub._id.toString(),
    );
  });

  it('should be able to create a meterChange', async () => {
    const mockMeterChangeStub = meterChangeDtoStubs();

    const response = await request(httpServer)
      .post(`/meter-changes`)
      .send(mockMeterChangeStub)
      .set('Authorization', token);

    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
  });

  it('should be able to update a meterChange', async () => {
    const mockMeterChangeStub = meterChangeStubs(meterChangeDtoStubs());
    const mockMeterChangeStubUpdate = meterChangeDtoStubs({
      firstConsumedNewMeter: 123,
    });

    await dbConnection
      .collection('meterchanges')
      .insertOne(mockMeterChangeStub);

    const response = await request(httpServer)
      .put(`/meter-changes/${mockMeterChangeStub._id}`)
      .send(mockMeterChangeStubUpdate)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.firstConsumedNewMeter).toEqual(
      mockMeterChangeStubUpdate.firstConsumedNewMeter,
    );
  });

  it('should be able to delete a meterChange', async () => {
    const mockMeterChangeStub = meterChangeStubs(meterChangeDtoStubs());

    await dbConnection
      .collection('meterchanges')
      .insertOne(mockMeterChangeStub);

    const response = await request(httpServer)
      .delete(`/meter-changes/${mockMeterChangeStub._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await dbConnection
      .collection('users')
      .deleteOne({ username: userDTOStub().username });
    await app.close();
  });
});
