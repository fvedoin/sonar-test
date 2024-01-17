import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { userDTOStub } from 'src/devices-gb/stubs/userDTOStub';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { createUcdisabledHistoryDtoStubs } from 'src/ucdisabled-history/stubs/ucdisabled-history.stub';

describe('ucdisabled-history', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let userService: UsersService;
  let responseAuthenticate: request.Response;
  let token: string;

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

  beforeAll(async () => {
    await dbConnection.collection('ucdisabledhistories').deleteMany({});
  });

  it(`should be able to return all ucdisabled-history`, async () => {
    const mockUcDisabledHistoryStub = createUcdisabledHistoryDtoStubs();
    await dbConnection
      .collection('ucdisabledhistories')
      .insertOne(mockUcDisabledHistoryStub);

    const response = await request(httpServer)
      .get('/ucdisabled-history')
      .set('Authorization', token);

    expect(response.status).toBe(200);
  });

  it(`should return 401 when not authenticated`, async () => {
    const response = await request(httpServer).get('/ucdisabled-history');
    expect(response.status).toBe(401);
  });

  describe(`should be able to return UcDisabledHistory using filtering`, () => {
    const UcsDisabledHistory: any = [];
    const DeviceGb = {
      _id: new Types.ObjectId('64de14f276116100688740d1'),
      allows: ['quality', 'measurements', 'faults', 'cutReconnect', 'billing'],
      type: 'LoRa',
      devId: 'fxrl2-00',
    };

    const clientId = {
      _id: new Types.ObjectId('64de077bd89e32004e59fb37'),
      modules: [
        'qualityGB',
        'exportGB',
        'alertsGB',
        'cutReconnectGB',
        'faultsGB',
        'qualityTR',
        'exportTR',
        'alertsTR',
        'exportGA',
        'alertsGA',
      ],
      name: 'Fox IoT',
    };

    const ucId = {
      _id: new Types.ObjectId('64de19d3febfa7dd4e2bd08e'),
      routeCode: 1,
      ucCode: '15',
      ucNumber: '0',
      ucClass: 'RESIDENCIAL',
      subClass: 'Residencial Normal',
      billingGroup: 1,
      ratedVoltage: 220,
      group: 'B',
    };

    const userId = {
      _id: new Types.ObjectId('64de1b2a7611610068874244'),
      username: 'admin@foxiot.com.br',
      name: 'Comercial',
      phone: '(99) 99999-9999',
      accessLevel: 'commercial',
    };

    beforeAll(async () => {
      await dbConnection.collection('devices').insertOne(DeviceGb);
      await dbConnection.collection('clients').insertOne(clientId);
      await dbConnection.collection('ucs').insertOne(ucId);
      await dbConnection.collection('users').insertOne(userId);

      UcsDisabledHistory.push({
        dataDeleted: true,
        userId: new Types.ObjectId('64de1b2a7611610068874244'),
        ucId: new Types.ObjectId('64de19d3febfa7dd4e2bd08e'),
        deviceId: new Types.ObjectId('64de14f276116100688740d1'),
        date: new Date('2023-08-30T14:00:00Z'),
        clientId: new Types.ObjectId('64de077bd89e32004e59fb37'),
        _id: new Types.ObjectId(),
      });
      UcsDisabledHistory.push({
        dataDeleted: true,
        userId: new Types.ObjectId('64de1b2a7611610068874244'),
        ucId: new Types.ObjectId('64de19d3febfa7dd4e2bd08e'),
        deviceId: new Types.ObjectId('64de14f276116100688740d1'),
        date: new Date('2023-08-31T15:00:00Z'),
        clientId: new Types.ObjectId('64de077bd89e32004e59fb37'),
        _id: new Types.ObjectId(),
      });
      await dbConnection
        .collection('ucdisabledhistories')
        .insertMany(UcsDisabledHistory);
    });

    it(`should be able to return all ucDisabledHistory`, async () => {
      const response = await request(httpServer)
        .get(`/ucdisabled-history?skip=0&limit=10&sort[date]=-1&searchText=`)
        .set('Authorization', token);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(3);
    });

    it(`should be able to return all ucDisabledHistory filtered by 'clientId'`, async () => {
      const response = await request(httpServer)
        .get(
          `/ucdisabled-history?skip=0&limit=10&clientId=${clientId.toString()}&fieldMask[clientId]=1,fieldMask[it]=1&fieldMask[feeder]=1&fieldMask[city]=1`,
        )
        .set('Authorization', token);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(3);
    });

    it(`should be able to return 2 ucDisabledhistory filtered by ucCode 15 `, async () => {
      const response = await request(httpServer)
        .get(
          `/ucdisabled-history?skip=0&limit=10&sort[date]=-1&searchText=&filter[0][ucId.ucCode][0]=15`,
        )
        .set('Authorization', token);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
    });

    it(`should be able to return 2 ucDisabledhistory filtered by devId fxrl2-00 `, async () => {
      const response = await request(httpServer)
        .get(
          `/ucdisabled-history?skip=0&limit=10&sort[deviceId.devId]=1&searchText=&filter[0][deviceId.devId][0]=fxrl2-00`,
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
    });

    it(`should be able to return 1 ucDisabledhistory filtered by date`, async () => {
      const response = await request(httpServer)
        .get(
          `/ucdisabled-history?skip=0&limit=10&sort[deviceId.devId]=1&searchText=&filter[0][dateRange][startDate][0]=${UcsDisabledHistory[1].date}&filter[0][dateRange][endDate]=2023-11-16T03:15:59.000Z`,
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(1);
      for (const ucdisabledHistory of response.body.data) {
        expect(new Date(ucdisabledHistory.date)).toEqual(
          UcsDisabledHistory[1].date,
        );
      }
    });

    it(`should be able to return 3 ucDisabledhistory filtered by date.endDate`, async () => {
      const response = await request(httpServer)
        .get(
          `/ucdisabled-history?skip=0&limit=10&sort[deviceId.devId]=1&searchText=&filter[0][dateRange][endDate]=2023-11-16T03:15:59.000Z`,
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(3);
    });

    it(`should be able to return 1 ucDisabledhistory filtered by date.startDate`, async () => {
      const response = await request(httpServer)
        .get(
          `/ucdisabled-history?skip=0&limit=10&sort[deviceId.devId]=1&searchText=&filter[0][dateRange][startDate][0]=${UcsDisabledHistory[1].date}`,
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(1);
    });

    it(`should be able to return 2 ucDisabledhistory filtered by user`, async () => {
      const response = await request(httpServer)
        .get(
          `/ucdisabled-history?skip=0&limit=10&sort[deviceId.devId]=1&searchText=&filter[0][userId.username][0]=admin@foxiot.com.br`,
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
      for (const ucdisabledHistory of response.body.data) {
        expect(ucdisabledHistory.userId.username).toEqual(
          'admin@foxiot.com.br',
        );
      }
    });

    it(`should be able to return all 3 UcDisabledHistory for sort (devId) descending`, async () => {
      const response = await request(httpServer)
        .get(
          `/ucdisabled-history?skip=0&limit=10&sort[deviceId.devId]=-1&searchText=`,
        )
        .set('Authorization', token);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(3);
    });

    it(`should be able to return all 3 UcDisabledHistory for sort (devId) growing`, async () => {
      const response = await request(httpServer)
        .get(
          `/ucdisabled-history?skip=0&limit=10&sort[deviceId.devId]=1&searchText=`,
        )
        .set('Authorization', token);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(3);
    });

    it(`should be able to return all 3 UcDisabledHistory for sort (ucCode) descending`, async () => {
      const response = await request(httpServer)
        .get(
          `/ucdisabled-history?skip=0&limit=10&sort[ucId.ucCode]=-1&searchText=`,
        )
        .set('Authorization', token);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(3);
    });

    it(`should be able to return all 3 UcDisabledHistory for sort (ucCode) growing`, async () => {
      const response = await request(httpServer)
        .get(
          `/ucdisabled-history?skip=0&limit=10&sort[ucId.ucCode]=1&searchText=`,
        )
        .set('Authorization', token);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(3);
    });
  });

  afterAll(async () => {
    await dbConnection
      .collection('users')
      .deleteOne({ username: userDTOStub().username });
    await dbConnection.collection('ucdisabledhistories').deleteMany({});
    await dbConnection.collection('devices').deleteMany({});
    await dbConnection.collection('clients').deleteMany({});
    await dbConnection.collection('ucs').deleteMany({});
    await dbConnection.collection('users').deleteMany({});
    await app.close();
  });
});
