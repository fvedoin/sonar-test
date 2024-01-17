import * as request from 'supertest';
import { Types } from 'mongoose';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ucDtoStubs } from 'src/faults/stubs/ucDto.stub';
import { deviceGBStub } from 'src/faults/stubs/deviceGB.stub';
import { bucketDtoStubs, bucketStubs } from 'src/faults/stubs/bucket.stub';
import { userDTOStub } from 'src/faults/stubs/userDTOStub';
import { influxConnectionStubDtoStubs } from 'src/faults/stubs/influxConnection.stub';

describe('Faults', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let userService: UsersService;
  let responseAuthenticate: request.Response;
  let token: string;
  const ucCode = 'ucd-768';

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
    expect(response.body.message).toBe(
      'Ocorreu um erro ao exportar o CSV das faltas.',
    );
  });

  it(`should be able to return 400 - no date range`, async () => {
    const response = await request(httpServer)
      .get(`/faults/export-csv?ucs=${ucCode}`)
      .set('Authorization', token);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Ocorreu um erro ao exportar o CSV das faltas.',
    );
    expect(response.body.stacktrace).toBe('DateRange é obrigatório.');
  });

  describe('Inserted UC', () => {
    beforeAll(async () => {
      //insert in db
      const deviceId = ucDtoStubs().deviceId;

      const mockUcsStub = ucDtoStubs(ucDtoStubs({ ucCode, deviceId }));
      const mockDeviceGBStub = deviceGBStub(deviceId);

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
      expect(response.body.message).toBe(
        'Ocorreu um erro ao exportar o CSV das faltas.',
      );
      expect(response.body.stacktrace).toBe(
        'Não foi possível encontrar um bucket.',
      );
    });
  });

  describe('Inserted UC & Bucket', () => {
    beforeAll(async () => {
      //insert in db
      const deviceId = ucDtoStubs().deviceId;
      const bucketId = deviceGBStub(deviceId).bucketId;

      const mockUcsStub = ucDtoStubs(ucDtoStubs({ ucCode, deviceId }));
      const mockDeviceGBStub = deviceGBStub(deviceId);

      const mockBucketStub = bucketStubs(
        bucketId as Types.ObjectId,
        bucketDtoStubs({
          clientId: mockUcsStub.clientId.toString(),
        }),
      );

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
      expect(response.body.message).toBe(
        'Ocorreu um erro ao exportar o CSV das faltas.',
      );
      expect(response.body.stacktrace).toBe(
        'Não foi possível encontrar uma conexão com o Influx.',
      );
    });
  });

  describe('Inserted UC & Device & Bucket & Influx Connection', () => {
    beforeAll(async () => {
      //insert in db
      const deviceId = ucDtoStubs().deviceId;

      const mockUcsStub = ucDtoStubs(ucDtoStubs({ ucCode, deviceId }));
      const mockDeviceGBStub = deviceGBStub(deviceId, { devId: ucCode });

      const influxConnectionStub = influxConnectionStubDtoStubs({
        host: process.env.INFLUX_HOST,
        orgId: process.env.INFLUX_ORG_ID,
        apiToken: process.env.INFLUX_API_TOKEN,
      });

      const influxConnectionCreated = await dbConnection
        .collection('influxconnections')
        .insertOne(influxConnectionStub);

      const bucketId = deviceGBStub(deviceId).bucketId;
      const mockBucketStub = bucketStubs(
        bucketId as Types.ObjectId,
        bucketDtoStubs({
          clientId: mockUcsStub.clientId.toString(),
          influxConnectionId: influxConnectionCreated.insertedId.toString(),
        }),
      );

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
      expect(response.body.message).toBe(
        'Ocorreu um erro ao exportar o CSV das faltas.',
      );
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
      .deleteOne({ username: userDTOStub().username });

    await dbConnection.collection('ucs').deleteMany({});
    await dbConnection.collection('devices').deleteMany({});
    await dbConnection.collection('buckets').deleteMany({});

    await app.close();
  });
});
