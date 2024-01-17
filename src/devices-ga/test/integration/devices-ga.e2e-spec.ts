import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { Connection, Types } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userDTOStub } from 'src/devices-ga/stub/userDTOStub';
import { deviceGAStub } from 'src/devices-ga/stub/deviceGA.stub';
import { Role } from 'src/auth/models/Role';
import { generateRandomQueryParams } from 'src/utils/utils';
import { createDevicesGaDtoStub } from 'src/devices-ga/stub/createDevicesGaDto.stub';
import { updateDevicesGaDtoStub } from 'src/devices-ga/stub/updateDevicesGaDto.stub';
import { DevicesGaService } from 'src/devices-ga/devices-ga.service';
import { clientStub } from 'src/devices-ga/stub/clientDTO.stub';

describe('Devices-ga', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let userService: UsersService;
  let service: DevicesGaService;
  let httpServer: any;

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
    service = moduleRef.get<DevicesGaService>(DevicesGaService);
    httpServer = app.getHttpServer();
  });

  describe('Access with access level ADMIN', () => {
    let token: string;
    const createUserDto: CreateUserDto = {
      ...userDTOStub(),
      accessLevel: Role.SUPER_ADMIN,
      username: 'admin@test.com',
    };

    beforeAll(async () => {
      await userService.create(createUserDto);

      const responseAuthenticate = await request(httpServer)
        .post('/login')
        .send({
          username: createUserDto.username,
          password: createUserDto.password,
        });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should be able to return all devices-ga`, async () => {
      const deviceGa = deviceGAStub(undefined, {
        clientId: new Types.ObjectId(createUserDto.clientId),
      });
      const deviceGaFromOhterClient = deviceGAStub();
      const mockClientStub = clientStub(deviceGa.clientId.toString());
      const mockSecondClientStub = clientStub(
        deviceGaFromOhterClient.clientId.toString(),
      );

      await dbConnection
        .collection('clients')
        .insertMany([mockClientStub, mockSecondClientStub]);
      await dbConnection
        .collection('devicesga')
        .insertMany([deviceGa, deviceGaFromOhterClient]);

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/devices-ga'))
        .set('Authorization', token);

      const everyDeviceFromResponseIsFromAllClients = response.body.data.every(
        (device) =>
          device.clientId._id === deviceGa.clientId.toString() ||
          device.clientId._id === deviceGaFromOhterClient.clientId.toString(),
      );

      expect(response.status).toBe(200);
      expect(everyDeviceFromResponseIsFromAllClients).toBeTruthy();
    });

    it(`should be able to create devices-ga`, async () => {
      const deviceGA = createDevicesGaDtoStub();

      const response = await request(httpServer)
        .post(generateRandomQueryParams('/devices-ga'))
        .send(deviceGA)
        .set('Authorization', token);

      await service.remove(response.body._id);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        ...deviceGA,
        _id: expect.any(String),
      });
    });

    it(`should be able to update devices-ga`, async () => {
      const deviceGa = deviceGAStub();
      const device = await dbConnection
        .collection('devicesga')
        .insertOne(deviceGa);

      const update = updateDevicesGaDtoStub();

      const response = await request(httpServer)
        .put(
          generateRandomQueryParams(
            `/devices-ga/${device.insertedId.toString()}`,
          ),
        )
        .send(update)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(update.name);
      expect(response.body.clientId).toBe(update.clientId.toString());
      expect(response.body.provider).toBe(update.provider);
    });

    it(`should be able to update devices-ga without changing the devId`, async () => {
      const deviceGa = deviceGAStub();
      const device = await dbConnection
        .collection('devicesga')
        .insertOne(deviceGa);

      const update = updateDevicesGaDtoStub();

      const response = await request(httpServer)
        .put(
          generateRandomQueryParams(
            `/devices-ga/${device.insertedId.toString()}`,
          ),
        )
        .send(update)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(update.name);
      expect(response.body.clientId).toBe(update.clientId.toString());
      expect(response.body.provider).toBe(update.provider);
      expect(response.body.devId).toBe(deviceGa.devId);
      expect(response.body.devId).not.toBe(update.devId);
    });

    it(`should be able to remove device-ga`, async () => {
      const mockDevice = {
        ...deviceGAStub(),
        clientId: deviceGAStub().clientId as Types.ObjectId,
      };

      const device = await service.create(mockDevice);

      const response = await request(httpServer)
        .delete(
          generateRandomQueryParams(`/devices-ga/${device._id.toString()}`),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
    });

    it(`should be able to remove multiple device-ga`, async () => {
      const numberOfDevices = 3;
      const devices = [];

      for (let i = 0; i < numberOfDevices; i++) {
        const mockDevice = {
          ...deviceGAStub(),
          clientId: deviceGAStub().clientId as Types.ObjectId,
          devId: `devId${i}`,
        };

        const createdDevice = await service.create(mockDevice);
        devices.push(createdDevice);
      }

      for (const device of devices) {
        const response = await request(httpServer)
          .delete(
            generateRandomQueryParams(`/devices-ga/${device._id.toString()}`),
          )
          .set('Authorization', token);

        expect(response.status).toBe(200);
      }
    });

    it(`should get an error when trying to remove device-ga`, async () => {
      const response = await request(httpServer)
        .delete(generateRandomQueryParams(`/devices-ga/${1}`))
        .set('Authorization', token);
      expect(response.status).toBe(400);
    });

    it(`should be able to return clientId`, async () => {
      const mockDeviceTrStub = deviceGAStub();
      const mockClientStub = clientStub(mockDeviceTrStub.clientId.toString());
      await dbConnection.collection('clients').insertOne(mockClientStub);
      await dbConnection.collection('devicesga').insertOne(mockDeviceTrStub);

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/devices-ga'))
        .set('Authorization', token);

      expect(response.body.data[0].clientId.name).toEqual(mockClientStub.name);
      expect(response.status).toBe(200);
    });

    afterEach(async () => {
      await dbConnection.collection('clients').deleteMany({});
      await dbConnection.collection('devicesga').deleteMany({});
    });

    afterAll(async () => {
      await dbConnection
        .collection('users')
        .deleteOne({ username: createUserDto.username });
    });
  });

  describe('Access with access level SUPPORT', () => {
    let supportToken: string;
    const createUserDto: CreateUserDto = {
      ...userDTOStub(),
      accessLevel: Role.SUPPORT,
      username: 'support@test.com',
    };

    beforeAll(async () => {
      await userService.create(createUserDto);

      const responseAuthenticate = await request(httpServer)
        .post('/login')
        .send({
          username: createUserDto.username,
          password: createUserDto.password,
        });

      supportToken = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should get an error when trying to create devices-ga  (not permission)`, async () => {
      const response = await request(httpServer)
        .post(generateRandomQueryParams('/devices-ga'))
        .set('Authorization', supportToken);

      expect(response.status).toBe(403);
    });

    it(`should get an error when trying to remove devices-ga (not permission)`, async () => {
      const mockDevice = {
        ...deviceGAStub(),
        clientId: deviceGAStub().clientId as Types.ObjectId,
      };

      const device = await service.create(mockDevice);

      const response = await request(httpServer)
        .delete(
          generateRandomQueryParams(`/devices-ga/${device._id.toString()}`),
        )
        .set('Authorization', supportToken);

      await service.remove([device._id.toString()]);
      expect(response.status).toBe(403);
    });

    it(`should get an error when trying to update device-ga (not permission)`, async () => {
      const deviceGa = deviceGAStub();
      const device = await dbConnection
        .collection('devicesga')
        .insertOne(deviceGa);

      const update = updateDevicesGaDtoStub();

      const response = await request(httpServer)
        .put(
          generateRandomQueryParams(
            `/devices-ga/${device.insertedId.toString()}`,
          ),
        )
        .send(update)
        .set('Authorization', supportToken);

      expect(response.status).toBe(403);
    });

    it(`should be able to return all devices-ga`, async () => {
      const mockDeviceTrStub = deviceGAStub();
      await dbConnection.collection('devicesga').insertOne(mockDeviceTrStub);

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/devices-ga'))
        .set('Authorization', supportToken);

      expect(response.status).toBe(200);
    });

    it(`should be able to return clientId`, async () => {
      const mockDeviceGaStub = deviceGAStub();
      const mockClientStub = clientStub(mockDeviceGaStub.clientId.toString());
      await dbConnection.collection('clients').insertOne(mockClientStub);
      await dbConnection.collection('devicesga').insertOne(mockDeviceGaStub);

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/devices-ga'))
        .set('Authorization', supportToken);
      expect(response.body.data[0].clientId.name).toEqual(mockClientStub.name);
      expect(response.status).toBe(200);
    });

    afterEach(async () => {
      await dbConnection.collection('devicesga').deleteMany({});
      await dbConnection.collection('clients').deleteMany({});
    });

    afterAll(async () => {
      await dbConnection
        .collection('users')
        .deleteOne({ username: createUserDto.username });

      await dbConnection.collection('devicesga').deleteMany({});
    });
  });

  describe('Access with access level COMMERCIAL', () => {
    let token: string;
    const createUserDto: CreateUserDto = {
      ...userDTOStub(),
      accessLevel: Role.ADMIN,
      username: 'commercial@test.com',
    };

    beforeAll(async () => {
      await userService.create(createUserDto);

      const responseAuthenticate = await request(httpServer)
        .post('/login')
        .send({
          username: createUserDto.username,
          password: createUserDto.password,
        });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should be able to return all devices-ga`, async () => {
      const deviceGa = deviceGAStub(undefined, {
        clientId: new Types.ObjectId(createUserDto.clientId),
      });
      const deviceGaFromOhterClient = deviceGAStub();

      const mockClientStub = clientStub(deviceGa.clientId.toString());
      const mockSecondClientStub = clientStub(
        deviceGaFromOhterClient.clientId.toString(),
      );
      const mockClientStubChildrenOfFirstClient = {
        ...clientStub(deviceGAStub().clientId.toString()),
        parendId: deviceGa.clientId,
      };

      await dbConnection
        .collection('clients')
        .insertMany([
          mockClientStub,
          mockSecondClientStub,
          mockClientStubChildrenOfFirstClient,
        ]);
      await dbConnection
        .collection('devicesga')
        .insertMany([deviceGa, deviceGaFromOhterClient]);

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/devices-ga'))
        .set('Authorization', token);

      const everyDeviceFromResponseIsOnlyFromFirstUserClientAndItsChildrens =
        response.body.data.every(
          (device) =>
            device.clientId._id === deviceGa.clientId.toString() ||
            device.clientId._id ===
              mockClientStubChildrenOfFirstClient._id.toString(),
        );
      expect(response.status).toBe(200);
      expect(
        everyDeviceFromResponseIsOnlyFromFirstUserClientAndItsChildrens,
      ).toBeTruthy();
    });

    it(`should get an error when trying to remove devices-ga (not permission)`, async () => {
      const mockDevice = {
        ...deviceGAStub(),
        clientId: deviceGAStub().clientId as Types.ObjectId,
      };

      const device = await service.create(mockDevice);

      const response = await request(httpServer)
        .delete(
          generateRandomQueryParams(`/devices-ga/${device._id.toString()}`),
        )
        .set('Authorization', token);

      await service.remove([device._id.toString()]);

      expect(response.status).toBe(403);
    });

    it(`should get an error when trying to create devices-ga`, async () => {
      const response = await request(httpServer)
        .post(generateRandomQueryParams('/devices-ga'))
        .set('Authorization', token);

      expect(response.status).toBe(403);
    });

    it(`should be able to update devices-ga - only name`, async () => {
      const deviceGa = deviceGAStub();
      const device = await dbConnection
        .collection('devicesga')
        .insertOne(deviceGa);

      const update = updateDevicesGaDtoStub();

      const response = await request(httpServer)
        .put(
          generateRandomQueryParams(
            `/devices-ga/${device.insertedId.toString()}`,
          ),
        )
        .send(update)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(update.name);
      expect(response.body.clientId).toBe(deviceGa.clientId.toString());
      expect(response.body.clientId).not.toBe(update.clientId.toString());
      expect(response.body.provider).toBe(deviceGa.provider);
      expect(response.body.provider).not.toBe(update.provider);
      expect(response.body.devId).toBe(deviceGa.devId);
      expect(response.body.devId).not.toBe(update.devId);
    });

    it(`should be able to update devices-ga without changing the devId`, async () => {
      const deviceGa = deviceGAStub();
      const device = await dbConnection
        .collection('devicesga')
        .insertOne(deviceGa);

      const newDevId = 'update';

      const update = { ...updateDevicesGaDtoStub(), devId: newDevId };

      const response = await request(httpServer)
        .put(
          generateRandomQueryParams(
            `/devices-ga/${device.insertedId.toString()}`,
          ),
        )
        .send(update)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(update.name);
      expect(response.body.clientId).toBe(deviceGa.clientId.toString());
      expect(response.body.clientId).not.toBe(update.clientId.toString());
      expect(response.body.provider).toBe(deviceGa.provider);
      expect(response.body.provider).not.toBe(update.provider);
      expect(response.body.devId).toBe(deviceGa.devId);
      expect(response.body.devId).not.toBe(update.devId);
    });

    afterEach(async () => {
      await dbConnection.collection('devicesga').deleteMany({});
    });

    afterAll(async () => {
      await dbConnection
        .collection('users')
        .deleteOne({ username: createUserDto.username });
    });
  });

  describe('Access with access level MANAGER', () => {
    let token: string;
    const createUserDto: CreateUserDto = {
      ...userDTOStub(),
      accessLevel: Role.MANAGER,
      username: 'manager@test.com',
    };

    beforeAll(async () => {
      await userService.create(createUserDto);

      const responseAuthenticate = await request(httpServer)
        .post('/login')
        .send({
          username: createUserDto.username,
          password: createUserDto.password,
        });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should be able to return all devices-ga`, async () => {
      const mockDeviceTrStub = deviceGAStub();
      await dbConnection.collection('devicesga').insertOne(mockDeviceTrStub);

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/devices-ga'))
        .set('Authorization', token);

      expect(response.status).toBe(200);
    });

    it(`should get an error when trying to create devices-ga`, async () => {
      const response = await request(httpServer)
        .post(generateRandomQueryParams('/devices-ga'))
        .set('Authorization', token);

      expect(response.status).toBe(403);
    });

    it(`should get an error when trying to remove devices-ga (not permission)`, async () => {
      const mockDevice = {
        ...deviceGAStub(),
        clientId: deviceGAStub().clientId as Types.ObjectId,
      };

      const device = await service.create(mockDevice);

      const response = await request(httpServer)
        .delete(
          generateRandomQueryParams(`/devices-ga/${device._id.toString()}`),
        )
        .set('Authorization', token);

      await service.remove([device._id.toString()]);

      expect(response.status).toBe(403);
    });

    it(`should be able to update devices-ga - only name`, async () => {
      const deviceGa = deviceGAStub();
      const device = await dbConnection
        .collection('devicesga')
        .insertOne(deviceGa);

      const update = updateDevicesGaDtoStub();

      const response = await request(httpServer)
        .put(
          generateRandomQueryParams(
            `/devices-ga/${device.insertedId.toString()}`,
          ),
        )
        .send(update)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(update.name);
      expect(response.body.clientId).toBe(deviceGa.clientId.toString());
      expect(response.body.clientId).not.toBe(update.clientId.toString());
      expect(response.body.provider).toBe(deviceGa.provider);
      expect(response.body.provider).not.toBe(update.provider);
      expect(response.body.devId).toBe(deviceGa.devId);
      expect(response.body.devId).not.toBe(update.devId);
    });

    it(`should be able to update devices-ga without changing the devId`, async () => {
      const deviceGa = deviceGAStub();
      const device = await dbConnection
        .collection('devicesga')
        .insertOne(deviceGa);

      const newDevId = 'update';

      const update = { ...updateDevicesGaDtoStub(), devId: newDevId };

      const response = await request(httpServer)
        .put(
          generateRandomQueryParams(
            `/devices-ga/${device.insertedId.toString()}`,
          ),
        )
        .send(update)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(update.name);
      expect(response.body.clientId).toBe(deviceGa.clientId.toString());
      expect(response.body.clientId).not.toBe(update.clientId.toString());
      expect(response.body.provider).toBe(deviceGa.provider);
      expect(response.body.provider).not.toBe(update.provider);
      expect(response.body.devId).toBe(deviceGa.devId);
      expect(response.body.devId).not.toBe(update.devId);
    });

    afterEach(async () => {
      await dbConnection.collection('devicesga').deleteMany({});
    });

    afterAll(async () => {
      await dbConnection
        .collection('users')
        .deleteOne({ username: createUserDto.username });
    });
  });

  describe('Access with access level VIEWER', () => {
    let token: string;
    const createUserDto: CreateUserDto = {
      ...userDTOStub(),
      accessLevel: Role.VIEWER,
      username: 'viewer@test.com',
    };

    beforeAll(async () => {
      await userService.create(createUserDto);

      const responseAuthenticate = await request(httpServer)
        .post('/login')
        .send({
          username: createUserDto.username,
          password: createUserDto.password,
        });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should get an error when trying to update device-ga (not permission)`, async () => {
      const deviceGa = deviceGAStub();
      const device = await dbConnection
        .collection('devicesga')
        .insertOne(deviceGa);

      const update = updateDevicesGaDtoStub();

      const response = await request(httpServer)
        .put(
          generateRandomQueryParams(
            `/devices-ga/${device.insertedId.toString()}`,
          ),
        )
        .send(update)
        .set('Authorization', token);

      expect(response.status).toBe(403);
    });

    it(`should get an error when trying to remove devices-ga (not permission)`, async () => {
      const mockDevice = {
        ...deviceGAStub(),
        clientId: deviceGAStub().clientId as Types.ObjectId,
      };

      const device = await service.create(mockDevice);

      const response = await request(httpServer)
        .delete(
          generateRandomQueryParams(`/devices-ga/${device._id.toString()}`),
        )
        .set('Authorization', token);

      await service.remove([device._id.toString()]);

      expect(response.status).toBe(403);
    });

    it(`should be able to return all devices-ga`, async () => {
      const mockDeviceTrStub = deviceGAStub();
      await dbConnection.collection('devicesga').insertOne(mockDeviceTrStub);

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/devices-ga'))
        .set('Authorization', token);

      expect(response.status).toBe(200);
    });

    it(`should get an error when trying to create devices-ga`, async () => {
      const response = await request(httpServer)
        .post(generateRandomQueryParams('/devices-ga'))
        .set('Authorization', token);

      expect(response.status).toBe(403);
    });

    afterEach(async () => {
      await dbConnection.collection('devicesga').deleteMany({});
    });

    afterAll(async () => {
      await dbConnection
        .collection('users')
        .deleteOne({ username: createUserDto.username });
    });
  });

  afterAll(async () => {
    await dbConnection
      .collection('users')
      .deleteOne({ username: userDTOStub().username });
    await dbConnection.collection('clients').deleteMany({});

    await app.close();
  });
});
