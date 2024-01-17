import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userDTOStub } from 'src/xml/stubs/userDTO.stub';
import { generateCSVQualityStubs } from 'src/xml/stubs/generateCSVQuality.stubs';
import { ucStubs } from 'src/xml/stubs/uc.stubs';
import { DeviceGb } from 'src/devices-gb/entities/devices-gb.entity';
import { bucketStubs } from 'src/xml/stubs/bucket.stub';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('Xml', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let userService: UsersService;
  let responseAuthenticate: request.Response;
  let token: string;
  const ucId = new Types.ObjectId();
  const deviceId = new Types.ObjectId();
  const bucketId = new Types.ObjectId();

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

    jest.spyOn(EventEmitter2.prototype, 'emit').mockReturnValue(null);
  });

  // beforeEach((): void => {
  //   jest.useFakeTimers();
  //   jest.setTimeout(60000);
  // });

  afterEach(async () => {
    await dbConnection.collection('ucs').deleteOne({ _id: ucId });
    await dbConnection.collection('devices').deleteOne({ _id: deviceId });
    await dbConnection.collection('buckets').deleteOne({ _id: bucketId });

    await dbConnection.collection('ucs').deleteMany({});
    await dbConnection.collection('devices').deleteMany({});
  });

  it('should return 201 when generate CSV quality', async () => {
    const dto = generateCSVQualityStubs();
    const mockUc = ucStubs();
    const mockDevice = ucStubs().deviceId as DeviceGb;
    const mockBucket = bucketStubs(bucketId);

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
  }, 100_000);

  // it('should return 201 when generate CSV measurements or billing', async () => {
  //   const dto = generateCSVStubs();
  //   const mockUc = ucStubs();
  //   const mockDevice = ucStubs().deviceId as DeviceGb;
  //   const mockBucket = bucketStubs(bucketId);

  //   await dbConnection.collection('buckets').insertOne(mockBucket);

  //   await dbConnection
  //     .collection('devices')
  //     .insertOne({ ...mockDevice, _id: deviceId, bucketId });

  //   await dbConnection
  //     .collection('ucs')
  //     .insertOne({ ...mockUc, _id: ucId, deviceId });

  //   const response = await request(httpServer)
  //     .post('/xml/export-csv')
  //     .set('Authorization', token)
  //     .send(dto);

  //   expect(response.status).toBe(201);
  // });

  // // it('should return 400 when generate CSV measurements or billing to 3 ucs with 91 days', async () => {
  // //   const now = new Date();
  // //   const ninetyDaysAgo = new Date(new Date().setDate(now.getDate() - 91));

  // //   const dateRange = {
  // //     startDate: ninetyDaysAgo.toString(),
  // //     endDate: now.toString(),
  // //   };

  // //   const mockBucket = bucketStubs(bucketId);

  // //   await dbConnection.collection('buckets').insertOne(mockBucket);

  // //   const devices = [];
  // //   const ucs = [];
  // //   const ucCodes = [];

  // //   const numberOfUcs = 3;

  // //   for (let i = 0; i < numberOfUcs; i++) {
  // //     const deviceId = new Types.ObjectId();
  // //     const mockUc = ucStubs(deviceId.toString());
  // //     const mockDevice = mockUc.deviceId as DeviceGb;
  // //     const uc = { ...mockUc, _id: new Types.ObjectId(), deviceId };

  // //     devices.push({ ...mockDevice, _id: deviceId, bucketId });
  // //     ucs.push(uc);
  // //     ucCodes.push(uc.ucCode);
  // //   }

  // //   await dbConnection.collection('devices').insertMany(devices);

  // //   await dbConnection.collection('ucs').insertMany(ucs);

  // //   const dto = generateCSVStubs(dateRange, ucCodes);

  // //   const response = await request(httpServer)
  // //     .post('/xml/export-csv')
  // //     .set('Authorization', token)
  // //     .send(dto);

  // //   expect(response.status).toBe(400);
  // //   expect(response.body.message).toBe(
  // //     'A consulta não pode incluir mais de 3 itens e um tempo maior que 90 dias!',
  // //   );
  // // });

  // it('should return 201 when generate CSV measurements or billing to 100 ucs to 5 hours', async () => {
  //   const now = new Date();
  //   const fiveHoursAgo = new Date(new Date().setHours(now.getHours() - 5));

  //   const dateRange = {
  //     startDate: fiveHoursAgo.toISOString(),
  //     endDate: now.toISOString(),
  //   };

  //   const mockBucket = bucketStubs(bucketId);

  //   await dbConnection.collection('buckets').insertOne(mockBucket);

  //   const devices = [];
  //   const ucs = [];
  //   const ucCodes = [];
  //   const numberOfUcs = 100;

  //   for (let i = 0; i < numberOfUcs; i++) {
  //     const deviceId = new Types.ObjectId();
  //     const mockUc = ucStubs(deviceId.toString());
  //     const uc = { ...mockUc, _id: new Types.ObjectId(), deviceId };

  //     const fakeDevice = deviceFakes(deviceId.toString(), bucketId.toString());

  //     devices.push(fakeDevice);
  //     ucs.push(uc);
  //     ucCodes.push(uc.ucCode);
  //   }

  //   await dbConnection.collection('devices').insertMany(devices);

  //   await dbConnection.collection('ucs').insertMany(ucs);

  //   const dto = generateCSVStubs(dateRange, ucCodes);

  //   const response = await request(httpServer)
  //     .post('/xml/export-csv')
  //     .set('Authorization', token)
  //     .send(dto);

  //   expect(response.status).toBe(201);
  // });

  // it('should return 201 when generate CSV measurements or billing to 100 ucs to 24 hours', async () => {
  //   const now = new Date();
  //   const twoDaysAgo = new Date(new Date().setDate(now.getDate() - 2));
  //   const _24HoursAgo = new Date(new Date().setHours(now.getHours() - 24)); // now - 47 hours

  //   const dateRange = {
  //     startDate: twoDaysAgo.toString(),
  //     endDate: now.toString(),
  //     startDate: _24HoursAgo.toISOString(),
  //     endDate: now.toISOString(),
  //   };

  //   const mockBucket = bucketStubs(bucketId);

  //   await dbConnection.collection('buckets').insertOne(mockBucket);

  //   const devices = [];
  //   const ucs = [];
  //   const ucCodes = [];

  //   const numberOfUcs = 100;

  //   for (let i = 0; i < numberOfUcs; i++) {
  //     const deviceId = new Types.ObjectId();
  //     const mockUc = ucStubs(deviceId.toString());
  //     const mockDevice = mockUc.deviceId as DeviceGb;
  //     const uc = { ...mockUc, _id: new Types.ObjectId(), deviceId };
  //     const fakeDevice = deviceFakes(deviceId.toString(), bucketId.toString());

  //     devices.push({ ...mockDevice, _id: deviceId, bucketId });
  //     devices.push(fakeDevice);
  //     ucs.push(uc);
  //     ucCodes.push(uc.ucCode);
  //   }

  //   await dbConnection.collection('devices').insertMany(devices);

  //   await dbConnection.collection('ucs').insertMany(ucs);

  //   const dto = generateCSVStubs(dateRange, ucCodes);

  //   const response = await request(httpServer)
  //     .post('/xml/export-csv')
  //     .set('Authorization', token)
  //     .send(dto);

  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toBe(
  //     'A consulta não pode incluir mais de 100 itens e um tempo maior que 1 dias!',
  //   );
  //   expect(response.status).toBe(201);
  // });

  // // it('should return 400 when generate CSV measurements or billing to 100 ucs to 2 days', async () => {
  // //   const now = new Date();
  // //   const twoDaysAgo = new Date(new Date().setDate(now.getDate() - 2));

  // //   const dateRange = {
  // //     startDate: twoDaysAgo.toString(),
  // //     endDate: now.toString(),
  // //   };

  // //   const mockBucket = bucketStubs(bucketId);

  // //   await dbConnection.collection('buckets').insertOne(mockBucket);

  // //   const devices = [];
  // //   const ucs = [];
  // //   const ucCodes = [];

  // //   const numberOfUcs = 100;

  // //   for (let i = 0; i < numberOfUcs; i++) {
  // //     const deviceId = new Types.ObjectId();
  // //     const mockUc = ucStubs(deviceId.toString());
  // //     const mockDevice = mockUc.deviceId as DeviceGb;
  // //     const uc = { ...mockUc, _id: new Types.ObjectId(), deviceId };

  // //     devices.push({ ...mockDevice, _id: deviceId, bucketId });
  // //     ucs.push(uc);
  // //     ucCodes.push(uc.ucCode);
  // //   }

  // //   await dbConnection.collection('devices').insertMany(devices);

  // //   await dbConnection.collection('ucs').insertMany(ucs);

  // //   const dto = generateCSVStubs(dateRange, ucCodes);

  // //   const response = await request(httpServer)
  // //     .post('/xml/export-csv')
  // //     .set('Authorization', token)
  // //     .send(dto);

  // //   expect(response.status).toBe(400);
  // //   expect(response.body.message).toBe(
  // //     'A consulta não pode incluir mais de 100 itens e um tempo maior que 1 dias!',
  // //   );
  // // });

  // afterAll(async (done) => {
  //   jest.setTimeout(50000);

  //   await dbConnection
  //     .collection('users')
  //     .deleteOne({ username: userDTOStub().username });
  //   await dbConnection.close();
  //   await app.close();
  // });
  afterAll(async () => {
    await dbConnection
      .collection('users')
      .deleteOne({ username: userDTOStub().username });
    await dbConnection.close();
    await app.close();
  });
});
