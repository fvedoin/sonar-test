import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import mongoose, { Connection, Types } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { userDTOStub } from 'src/devices-gb/stubs/userDTOStub';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { deviceGbStub } from 'src/devices-gb/stubs/devices-gb.stub';
import { clientStub } from 'src/devices-gb/stubs/clientDTO.stub';
import { influxConnectionStubDtoStubs } from 'src/devices-gb/stubs/influxConnection.stub';
import { ucStubs } from 'src/devices-gb/stubs/uc.stub';
import { ucDtoStubs } from 'src/devices-gb/stubs/ucDto.stub';
import { deviceGBStub } from 'src/devices-gb/stubs/deviceGB.stub';
import { bucketDtoStubs, bucketStub } from 'src/devices-gb/stubs/bucket.stub';
import axios from 'axios';
import { TtnService } from 'src/common/services/ttn.service';
import queryGetAllDataByDevId from 'src/influx/utils/queryGetAllData';
import { applicationStubs } from 'src/devices-gb/stubs/application.stub';
import { generateRandomQueryParams } from 'src/utils/utils';
import { Role } from 'src/auth/models/Role';
import { Client } from 'src/clients/entities/client.entity';

describe('Devices-gb', () => {
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

  it(`should be able to return all devices-gb`, async () => {
    const mockDeviceTrStub = deviceGbStub();
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
    const mockDeviceGbStub = deviceGbStub();
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
    const mockDevicesStub = deviceGbStub();
    const mockClientStub = clientStub(mockDevicesStub.clientId);

    beforeAll(async () => {
      devices.push({
        type: 'LoRa',
        devId: 'fxrl-02',
        name: 'fxrl-02',
        communication: 'PIMA',
        description: '',
        allows: ['Medidas instantâneas'],
        clientId,
        _id: new Types.ObjectId(),
      });
      devices.push({
        type: 'teste',
        devId: 'fxrl-03',
        name: 'fxrl-03',
        communication: 'teste',
        description: '',
        allows: ['Corte/religa'],
        clientId,
        _id: new Types.ObjectId(),
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
        .get(
          `/devices-gb?skip=0&limit=10&clientId=${clientId.toString()}&fieldMask[clientId]=1,fieldMask[devId]=1&fieldMask[name]=1&fieldMask[description]=1`,
        )
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
        .get(
          `/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][allows][0]=${mockDevicesStub.allows[0]}&filter[0][allows][1]=${mockDevicesStub.allows[1]}`,
        )
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
        .get(
          `/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][allows][0]=${devices[0].allows[0]}&filter[0][allows][1]=${mockDevicesStub.allows[1]}`,
        )
        .set('Authorization', token);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
    });

    it(`should be able to return 2 devices filtered by type and ucCode`, async () => {
      const response = await request(httpServer)
        .get(
          `/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][type][0]=${mockDevicesStub.type}&filter[1][communication][0]=${mockDevicesStub.communication}`,
        )
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
        .get(
          `/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][type][0]=${devices[1].type}&filter[1][communication][0]=${devices[1].communication}`,
        )
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
        .get(
          `/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][type][0]=${devices[1].type}&filter[1][communication][0]=${devices[1].communication}`,
        )
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
        .get(
          `/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][devId][0]=${devices[0].devId}&filter[0][devId][1]=${devices[1].devId}`,
        )
        .set('Authorization', token);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
    });

    it(`should be able to return all 3 devices filtered by devId`, async () => {
      const response = await request(httpServer)
        .get(
          `/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][devId][0]=${devices[0].devId}&filter[0][devId][1]=${devices[1].devId}&filter[0][devId][2]=${mockDevicesStub.devId}`,
        )
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
    //ESTES TESTES PRECISAM DO INFLUXDB
    it('success - transfer data', async () => {
      const deviceId = new Types.ObjectId(
        '640667dd2d824a3ec7cde788',
      ).toString();
      const applicationId = new Types.ObjectId('640667dd2d824a3ec7cde788');

      const deviceId2 = new Types.ObjectId().toString();

      // Tem que ser idêntico ao banco local
      const influxConnectionStub = influxConnectionStubDtoStubs({
        host: process.env.INFLUX_HOST,
        orgId: process.env.INFLUX_ORG_ID,
        apiToken: process.env.INFLUX_API_TOKEN,
      });

      const influxConnectionCreated = await dbConnection
        .collection('influxconnections')
        .insertOne(influxConnectionStub);

      const bucketId = new Types.ObjectId('62179b4f4e4e0029f068f7b6');

      const mockUcsStub = ucStubs(ucDtoStubs({ ucCode: '123', deviceId }));

      const mockBucketStub = bucketStub(
        bucketId,
        bucketDtoStubs({
          clientId: mockUcsStub.clientId.toString(),
          influxConnectionId: influxConnectionCreated.insertedId.toString(),
        }),
      );

      const device = deviceGBStub(deviceId, { bucketId });
      const deviceToChange = deviceGBStub(deviceId2, {
        devId: 'teste2',
        applicationId,
      });

      const application = applicationStubs(applicationId);

      await dbConnection.collection('devices').insertOne(device);
      await dbConnection.collection('devices').insertOne(deviceToChange);
      await dbConnection.collection('applications').insertOne(application);
      await dbConnection.collection('buckets').insertOne(mockBucketStub);

      const axiosPostSpy = jest.spyOn(axios, 'post');

      const dev_eui = '123456';

      //Unfortunately we need mock this :/
      const TtnServiceSpy = jest.spyOn(TtnService, 'get');

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

      expect(TtnServiceSpy).toHaveBeenNthCalledWith(
        1,
        `applications/${application.appId}/devices/${deviceToChange.devId}`,
      );

      expect(axiosPostSpy).toHaveBeenNthCalledWith(
        1,
        `${influxConnectionStub.host}/api/v2/query`,
        queryGetAllDataByDevId({
          bucketName: mockBucketStub.name,
          devId: device.devId,
        }),
        {
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
        },
      );

      expect(response.status).toBe(200);

      axiosPostSpy.mockRestore();
      TtnServiceSpy.mockRestore();
    });

    it('success - transfer data & delete Data', async () => {
      const deviceId = new Types.ObjectId(
        '640667dd2d824a3ec7cde788',
      ).toString();
      const applicationId = new Types.ObjectId('640667dd2d824a3ec7cde788');

      const deviceId2 = new Types.ObjectId().toString();

      // Tem que ser idêntico ao banco local
      const influxConnectionStub = influxConnectionStubDtoStubs({
        host: process.env.INFLUX_HOST,
        orgId: process.env.INFLUX_ORG_ID,
        apiToken: process.env.INFLUX_API_TOKEN,
      });

      const influxConnectionCreated = await dbConnection
        .collection('influxconnections')
        .insertOne(influxConnectionStub);

      const bucketId = new Types.ObjectId('62179b4f4e4e0029f068f7b6');

      const mockUcsStub = ucStubs(ucDtoStubs({ ucCode: '123', deviceId }));

      const device = deviceGBStub(deviceId, { bucketId });
      const deviceToChange = deviceGBStub(deviceId2, {
        devId: 'teste2',
        applicationId,
      });

      const mockBucketStub = bucketStub(
        bucketId,
        bucketDtoStubs({
          clientId: mockUcsStub.clientId.toString(),
          influxConnectionId: influxConnectionCreated.insertedId.toString(),
        }),
      );

      const application = applicationStubs(applicationId);

      await dbConnection
        .collection('clients')
        .insertOne(clientStub(mockUcsStub.clientId.toString()));
      await dbConnection.collection('ucs').insertOne(mockUcsStub);
      await dbConnection.collection('devices').insertOne(device);
      await dbConnection.collection('devices').insertOne(deviceToChange);
      await dbConnection.collection('applications').insertOne(application);
      await dbConnection.collection('buckets').insertOne(mockBucketStub);

      const axiosPostSpy = jest.spyOn(axios, 'post');

      const dev_eui = '123456';

      //Unfortunately we need mock this :/
      const TtnServiceSpy = jest.spyOn(TtnService, 'get');

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

      expect(TtnServiceSpy).toHaveBeenNthCalledWith(
        1,
        `applications/${application.appId}/devices/${deviceToChange.devId}`,
      );

      expect(axiosPostSpy).toHaveBeenNthCalledWith(
        1,
        `${influxConnectionStub.host}/api/v2/query`,
        queryGetAllDataByDevId({
          bucketName: mockBucketStub.name,
          devId: device.devId,
        }),
        {
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
        },
      );

      expect(axiosPostSpy).toHaveBeenNthCalledWith(
        2,
        `${influxConnectionStub.host}/api/v2/delete`,
        {
          predicate: `"dev_id" = "${device.devId}"`,
          start: expect.any(String),
          stop: expect.any(String),
        },
        {
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
        },
      );

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
    let token: string;
    const userDTO = {
      ...userDTOStub(),
      accessLevel: Role.ADMIN,
      username: 'devices-gb@commercial.com.br',
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

    const createDevicesAndClients = async () => {
      const devicesGB = [];

      for (let i = 0; i < 5; i++) {
        devicesGB.push({
          ...deviceGBStub(new mongoose.Types.ObjectId().toString(), {}),
          clientId: new mongoose.Types.ObjectId(),
          devId: new mongoose.Types.ObjectId().toString(),
        });
      }

      const parentDevice = {
        ...deviceGBStub(new mongoose.Types.ObjectId().toString(), {}),
        clientId: new mongoose.Types.ObjectId(userDTO.clientId),
        devId: new mongoose.Types.ObjectId().toString(),
      };

      devicesGB.push(parentDevice);

      const childClientId = new mongoose.Types.ObjectId().toString();

      const mockClientSonStub: Client = {
        ...clientStub(childClientId),
        parentId: new mongoose.Types.ObjectId(userDTO.clientId),
      };

      const mockClientParentStub: Client = {
        ...clientStub(userDTO.clientId),
        cnpj: '123456',
        parentId: null,
      };

      const childDevice = {
        ...deviceGBStub(new mongoose.Types.ObjectId().toString(), {}),
        clientId: new mongoose.Types.ObjectId(childClientId),
        devId: new mongoose.Types.ObjectId().toString(),
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
        .get(generateRandomQueryParams('/devices-gb'))
        .set('Authorization', token);

      expect(response.body.data).toHaveLength(2);
    });

    it('Get All - Should be an array with the complete devices-gb data', async () => {
      const { clientIds } = await createDevicesAndClients();
      const response = await request(httpServer)
        .get(generateRandomQueryParams('/devices-gb'))
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
        .get(
          generateRandomQueryParams(
            `/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][devId][0]=${parentDevice.devId}`,
          ),
        )
        .set('Authorization', token);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(1);
    });

    it(`should be able to return all 1 devices filtered by child device devId`, async () => {
      const { childDevice } = await createDevicesAndClients();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/devices-gb?skip=0&limit=10&sort[devId]=1&searchText=&filter[0][devId][0]=${childDevice.devId}`,
          ),
        )
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
      .deleteOne({ username: userDTOStub().username });
    await dbConnection.collection('clients').deleteMany({});
    await dbConnection.collection('devices').deleteMany({});
    await dbConnection.collection('influxconnections').deleteMany({});
    await dbConnection.collection('offlinealertjobs').deleteMany({});
    await dbConnection.collection('applications').deleteMany({});
    await app.close();
  });
});
