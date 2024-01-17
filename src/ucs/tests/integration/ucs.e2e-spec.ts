import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import axios from 'axios';

import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userDTOStub } from '../../stubs/userDTO.stub';
import { ucStubs } from '../../stubs/uc.stub';
import { ucDtoStubs } from '../../stubs/ucDto.stub';
import { ucCsvStub } from 'src/ucs/stubs/ucCsv.stub';
import { deviceGBStub } from 'src/ucs/stubs/deviceGB.stub';
import { bucketDtoStubs, bucketStubs } from 'src/ucs/stubs/bucket.stub';
import { transformerStubs } from 'src/ucs/stubs/transformer.stub';
import { clientStub } from 'src/ucs/stubs/client.stub';
import { influxConnectionStubDtoStubs } from 'src/ucs/stubs/influxConnection.stub';
import queryGetAllDataByDevId from 'src/influx/utils/queryGetAllData';
import { DevicesGbService } from 'src/devices-gb/devices-gb.service';
import { CreateDevicesGbDto } from 'src/devices-gb/dto/create-devices-gb.dto';
import { applicationStubs } from 'src/devices-gb/stubs/application.stub';
import { TtnService } from 'src/common/services/ttn.service';
import { Role } from 'src/auth/models/Role';
import { SanitizeUser } from 'src/users/dto/sanitarize-user.dto';
import { generateRandomQueryParams } from 'src/utils/utils';
import { lastReceivedListStub } from 'src/ucs/stubs/lastReceived.stub';
import { csvFileStub } from 'src/ucs/stubs/csvFile.stub';
import { file } from 'src/ucs/stubs/file.stub';

describe('Ucs', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let userService: UsersService;
  let responseAuthenticate: request.Response;

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
  });

  describe('User - SUPER_ADMIN', () => {
    let token: string;
    const createUserDto: CreateUserDto = userDTOStub({
      accessLevel: Role.SUPER_ADMIN,
      username: 'admin@test.com',
    });

    beforeAll(async () => {
      await userService.create(createUserDto);
      responseAuthenticate = await request(httpServer).post('/login').send({
        username: createUserDto.username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    beforeEach(async () => {
      await dbConnection
        .collection('ucs')
        .deleteMany({ routeCode: ucDtoStubs().routeCode });

      await dbConnection.collection('ucs').deleteMany({});
      await dbConnection.collection('devices').deleteMany({});
      await dbConnection.collection('clients').deleteMany({});
      await dbConnection.collection('buckets').deleteMany({});
      await dbConnection.collection('influxconnections').deleteMany({});
      await dbConnection.collection('offlinealertjobs').deleteMany({});
      await dbConnection.collection('applications').deleteMany({});
      await dbConnection.collection('transformers').deleteMany({});
    });

    const createToClient = ({ mockUcsStub, devices, ucs, transformers }) => {
      const device = {
        _id: new Types.ObjectId(),
        devId: `teste-${new Types.ObjectId()}`,
        allows: ['quality'],
        type: 'LoRa',
        clientId: new Types.ObjectId(mockUcsStub.clientId as string),
      };

      const transformer = {
        _id: new Types.ObjectId(),
        clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
        it: new Types.ObjectId().toString(),
      };

      transformers.push(transformer);

      devices.push(device);

      ucs.push({
        ...mockUcsStub,
        _id: new Types.ObjectId(),
        deviceId: device._id,
        transformerId: transformer._id,
        ucCode: new Types.ObjectId().toString(),
        clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
      });
    };

    const createToRandomClient = ({
      randomTransformers,
      randomDevices,
      randomUcs,
      randomClient,
      mockUcsStub,
    }) => {
      for (let i = 0; i < 3; i++) {
        const device = {
          _id: new Types.ObjectId(),
          devId: `teste-${new Types.ObjectId()}`,
          allows: ['quality'],
          type: 'LoRa',
          clientId: randomClient._id,
        };

        const transformer = {
          _id: new Types.ObjectId(),
          clientId: randomClient._id,
          it: new Types.ObjectId().toString(),
        };

        randomTransformers.push(transformer);

        randomDevices.push(device);

        randomUcs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: device._id,
          transformerId: transformer._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: randomClient._id,
        });
      }
    };

    const createUcDeviceLastReceived = async () => {
      const mockUcsStub = ucStubs(
        ucDtoStubs({ clientId: createUserDto.clientId }),
      );

      const client = clientStub(createUserDto.clientId.toString());

      const randomClient = {
        ...clientStub(new Types.ObjectId().toString()),
        name: 'random',
      };

      const randomUcs = [];
      const ucs = [];

      const randomDevices = [];
      const devices = [];

      const transformers = [];
      const randomTransformers = [];

      createToClient({
        mockUcsStub,
        devices,
        ucs,
        transformers,
      });
      createToRandomClient({
        mockUcsStub,
        randomClient,
        randomDevices,
        randomTransformers,
        randomUcs,
      });

      const lastReceivedList = lastReceivedListStub(devices[0]._id);

      Promise.all([
        await dbConnection
          .collection('transformers')
          .insertMany([...transformers, ...randomTransformers]),
        await dbConnection
          .collection('lastreceiveds')
          .insertMany(lastReceivedList),
        await dbConnection
          .collection('devices')
          .insertMany([...devices, ...randomDevices]),
        await dbConnection.collection('ucs').insertMany([...ucs, ...randomUcs]),
        await dbConnection.collection('clients').insertOne(client),
        await dbConnection.collection('clients').insertOne(randomClient),
      ]);

      return {
        randomClient,
        randomDevices,
        randomUcs,
        lastReceivedList,
        randomTransformers,
        ucs,
        client,
        devices,
        transformers,
      };
    };

    it('should be able to upload csv', async () => {
      const imageName = 'test.csv';

      const clientId = '12456';
      const it = '3';
      const transformer = await dbConnection
        .collection('transformers')
        .insertOne(transformerStubs(it));

      const response = await request(httpServer)
        .post(generateRandomQueryParams(`/ucs/upload`))
        .set('Content-Type', 'multipart/form-data')
        .attach('file', file().buffer, imageName)
        .field('clientId', clientId)
        .set('Authorization', token);

      expect(response.status).toBe(201);

      for (const uc of response.body) {
        expect(uc.operation).toBeDefined();
        expect(['Editar', 'Inserir'].includes(uc.operation)).toBe(true);
        expect(uc.clientId).toBe(clientId);
        expect(uc.transformerId).toBe(transformer.insertedId.toString());
        expect(uc.transformer).toBe(it);
        expect(uc.ucCode).toBeDefined();
        expect(JSON.stringify(uc.location)).toBe(
          JSON.stringify({
            type: 'Point',
            coordinates: [-52.00259612357232, -28.06239175648157],
          }),
        );
        expect(uc.ucNumber).toBeDefined();
        expect(uc.ucClass).toBeDefined();
        expect(uc.subClass).toBeDefined();
        expect(uc.billingGroup).toBeDefined();
        expect(uc.group).toBeDefined();
        expect(uc.routeCode).toBeDefined();
        expect(uc.timeZone).toBeDefined();
        expect(uc.sequence).toBeDefined();
        expect(uc.phases).toBeDefined();
        expect(uc.circuitBreaker).toBeDefined();
        expect(uc.circuitBreaker).toBeDefined();
      }
    });

    it('Should not accept any other file type than csv', async () => {
      const imageName = 'test.txt';

      const response = await request(httpServer)
        .post(generateRandomQueryParams(`/ucs/upload`))
        .set('Content-Type', 'multipart/form-data')
        .attach('file', file().buffer, imageName)
        .field('clientId', '12456')
        .set('Authorization', token);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'O arquivo deve ter uma extensão válida: csv.',
      );
    });

    it(`Should send the data for map page`, async () => {
      await createUcDeviceLastReceived();

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/ucs'))
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(4);
      expect(response.body[0].lastReceived.length).toBe(
        lastReceivedListStub().length,
      );
      const portsInOrder = response.body[0].lastReceived.map(
        (item) => item.port,
      );
      expect(portsInOrder).toEqual([0, 1, 2, 3]);

      for (const lastReceived of response.body[0].lastReceived) {
        expect(lastReceived.receivedAt).toBeDefined();

        if (lastReceived?.package?.relay_out) {
          expect(lastReceived.package).toMatchObject({
            cable_status: expect.any(Number),
            relay_out: expect.any(Number),
            consumed_total_energy: expect.any(Number),
            voltage_phase_a: expect.any(Number),
            voltage_phase_b: expect.any(Number),
            voltage_phase_c: expect.any(Number),
            power_factor_phase_a: expect.any(Number),
            power_factor_phase_b: expect.any(Number),
            power_factor_phase_c: expect.any(Number),
            active_power_phase_a: expect.any(Number),
            active_power_phase_b: expect.any(Number),
            active_power_phase_c: expect.any(Number),
          });
        }
      }
    });

    it(`should be able to return all ucs using filter clientId.name`, async () => {
      const mockUcsStub = ucStubs(ucDtoStubs());

      const ucs = [];

      for (let i = 0; i < 2; i++) {
        ucs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: new Types.ObjectId(),
          ucCode: new Types.ObjectId().toString(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
        });
      }

      const clientId = new Types.ObjectId();
      await dbConnection.collection('clients').insertOne({
        name: 'Client 0',
        address: 'Testing Address',
        cnpj: '11111',
        initials: '1111',
        local: '111',
        modules: ['test'],
        _id: new Types.ObjectId(),
        it: new Types.ObjectId(),
      });

      await dbConnection.collection('clients').insertOne({
        name: 'Client 1',
        address: 'Testing Address',
        cnpj: '11111',
        initials: '1111',
        local: '111',
        modules: ['test'],
        _id: clientId,
        it: new Types.ObjectId(),
      });

      for (let i = 0; i < 2; i++) {
        ucs.push({
          ...mockUcsStub,
          ucCode: new Types.ObjectId().toString(),
          _id: new Types.ObjectId(),
          deviceId: new Types.ObjectId(),
          clientId,
        });
      }

      await dbConnection.collection('ucs').insertMany(ucs);

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/paginate?filter[0][clientId.name][0]=Client 1`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
      expect(response.body.data[0]._id).toBeDefined();
    });

    const createUcDevicesAndClientsAndUCSWithoutDevices = async () => {
      const mockUcsStub = ucStubs(
        ucDtoStubs({ clientId: createUserDto.clientId }),
      );

      const client = clientStub(createUserDto.clientId.toString());
      const otherClient = clientStub(new Types.ObjectId().toString());

      const ucs = [];
      const ucsWithoutDevices = [];
      const devices = [];
      const activeDevices = [];

      const ownDevice = {
        _id: new Types.ObjectId(),
        devId: `active-${new Types.ObjectId()}`,
        allows: ['quality'],
        clientId: client._id,
        type: 'LoRa',
      };

      activeDevices.push(ownDevice);
      devices.push(ownDevice);

      for (let i = 0; i < 2; i++) {
        const activeDevice = {
          _id: new Types.ObjectId(),
          devId: `active-${new Types.ObjectId()}`,
          allows: ['quality'],
          clientId: new Types.ObjectId(),
          type: 'LoRa',
        };
        activeDevices.push(activeDevice);
        devices.push(activeDevice);
      }

      for (let i = 0; i < 2; i++) {
        const inactiveDevice = {
          devId: `ucd-${new Types.ObjectId()}`,
          _id: new Types.ObjectId(),
          allows: ['measurements', 'faults'],
          clientId: new Types.ObjectId(),
          type: 'GSM',
        };

        devices.push(inactiveDevice);
      }

      for (let i = 0; i < devices.length; i++) {
        ucs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: devices[i]._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
        });
      }

      const ucWithoutDevices = {
        ...mockUcsStub,
        _id: new Types.ObjectId(),
        transformerId: new Types.ObjectId().toString(),
        ucCode: new Types.ObjectId().toString(),
        clientId: otherClient._id,
      };

      ucs.push(ucWithoutDevices);
      ucsWithoutDevices.push(ucWithoutDevices);

      await dbConnection.collection('devices').insertMany(devices);
      await dbConnection.collection('ucs').insertMany(ucs);
      await dbConnection.collection('clients').insertOne(client);
      await dbConnection.collection('clients').insertOne(otherClient);

      return {
        client,
        otherClient,
        devices,
        ucsWithoutDevices,
        ucs,
        activeDevices,
      };
    };

    it(`should be able to return all ucs (2 active e 1 device=null) using filter deviceId.devId=Ativada & client_id`, async () => {
      const { ucsWithoutDevices, activeDevices } =
        await createUcDevicesAndClientsAndUCSWithoutDevices();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/paginate?filter[0][deviceId.devId][0]=Ativada`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(
        ucsWithoutDevices.length + activeDevices.length,
      );

      const reg = /^(?!ucd)/;
      for (const uc of response.body.data) {
        if (uc.deviceId) {
          expect(uc.deviceId.devId).toMatch(reg);
        } else {
          expect(uc.deviceId).toBe(null);
        }
      }
    });

    it(`should be able to return all ucs using filter deviceId.allows`, async () => {
      const mockUcsStub = ucStubs(ucDtoStubs());

      const ucs = [];
      const devicesIds = [];

      for (let i = 0; i < 2; i++) {
        devicesIds.push({
          devId: new Types.ObjectId().toString(),
          _id: new Types.ObjectId(),
          allows: ['quality'],
        });
      }

      for (let i = 0; i < 2; i++) {
        devicesIds.push({
          devId: new Types.ObjectId().toString(),
          _id: new Types.ObjectId(),
          allows: ['measurements'],
        });
      }

      for (let i = 0; i < 2; i++) {
        devicesIds.push({
          devId: new Types.ObjectId().toString(),
          _id: new Types.ObjectId(),
          allows: ['faults'],
        });
      }

      await dbConnection.collection('devices').insertMany(devicesIds);

      for (let i = 0; i < 6; i++) {
        ucs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: devicesIds[i]._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
        });
      }

      await dbConnection.collection('ucs').insertMany(ucs);
      await dbConnection
        .collection('clients')
        .insertOne(clientStub(mockUcsStub.clientId.toString()));

      const response = await request(httpServer)
        .get(
          `/ucs/paginate?filter[0][deviceId.allows][0]=quality&filter[0][deviceId.allows][1]=measurements`,
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(4);
      expect(response.body.data[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs using filter deviceId.devId=Ativada`, async () => {
      const mockUcsStub = ucStubs(ucDtoStubs());

      const ucs = [];
      const devicesIds = [];

      for (let i = 0; i < 2; i++) {
        devicesIds.push({
          devId: `ucd-${new Types.ObjectId()}`,
          _id: new Types.ObjectId(),
          allows: ['quality'],
        });
      }

      for (let i = 0; i < 2; i++) {
        devicesIds.push({
          devId: `fxr-${new Types.ObjectId()}`,
          _id: new Types.ObjectId(),
          allows: ['measurements'],
        });
      }

      await dbConnection.collection('devices').insertMany(devicesIds);

      for (let i = 0; i < 4; i++) {
        ucs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: devicesIds[i]._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
        });
      }

      await dbConnection.collection('ucs').insertMany(ucs);
      await dbConnection
        .collection('clients')
        .insertOne(clientStub(mockUcsStub.clientId.toString()));

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/paginate?filter[0][deviceId.devId][0]=Ativada`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
      const reg = /^(?!ucd)/;
      for (const data of response.body.data) {
        expect(data.deviceId.devId).toMatch(reg);
      }
    });

    it(`should be able to return all ucs using filter deviceId.devId=Desativada`, async () => {
      const mockUcsStub = ucStubs(ucDtoStubs());

      const ucs = [];
      const devicesIds = [];

      for (let i = 0; i < 2; i++) {
        devicesIds.push({
          devId: `ucd-${i}`,
          _id: new Types.ObjectId(),
          allows: ['quality'],
        });
      }

      for (let i = 0; i < 2; i++) {
        devicesIds.push({
          devId: `fxr-${i}`,
          _id: new Types.ObjectId(),
          allows: ['measurements'],
        });
      }

      await dbConnection.collection('devices').insertMany(devicesIds);

      for (let i = 0; i < 4; i++) {
        ucs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: devicesIds[i]._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
        });
      }

      await dbConnection.collection('ucs').insertMany(ucs);
      await dbConnection
        .collection('clients')
        .insertOne(clientStub(mockUcsStub.clientId.toString()));

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/paginate?filter[0][deviceId.devId][0]=Desativada`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);

      const reg = /^ucd/;
      for (const data of response.body.data) {
        expect(data.deviceId.devId).toMatch(reg);
      }
    });

    it(`should be able to return all ucs`, async () => {
      const mockUcsStub = ucStubs(ucDtoStubs());

      await dbConnection.collection('ucs').insertOne({
        ...mockUcsStub,
        clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
      });

      const response = await request(httpServer)
        .get('/ucs')
        .query({ clientId: ucDtoStubs().clientId.toString() })
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body[0]._id).toBeDefined();
    });

    it(`should be able to return a uc by id`, async () => {
      const mockUcsStub = ucStubs(ucDtoStubs());
      await dbConnection.collection('ucs').insertOne(mockUcsStub);

      const response = await request(httpServer)
        .get(generateRandomQueryParams(`/ucs/${mockUcsStub._id}`))
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body._id.toString()).toEqual(mockUcsStub._id.toString());
    });

    it('should be able to create a uc', async () => {
      const mockUcsStub = ucDtoStubs();

      const response = await request(httpServer)
        .post(`/ucs`)
        .send(mockUcsStub)
        .set('Authorization', token);

      expect(response.status).toBe(201);
      expect(response.body._id).toBeDefined();
    });

    it('should be able to update a uc', async () => {
      const deviceId = new Types.ObjectId(
        '640667dd2d824a3ec7cde788',
      ).toString();
      const mockUcsStub = ucStubs(ucDtoStubs({ ucCode: '123', deviceId }));
      const mockUcStubUpdate = ucDtoStubs({ ucCode: '1253' });
      const mockDeviceGBStub = deviceGBStub(deviceId);

      await dbConnection.collection('ucs').insertOne(mockUcsStub);
      await dbConnection.collection('devices').insertOne(mockDeviceGBStub);

      const response = await request(httpServer)
        .put(`/ucs/${mockUcsStub._id}`)
        .send(mockUcStubUpdate)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.ucCode).toEqual(mockUcStubUpdate.ucCode);
    });

    describe('should be able to disable', () => {
      //ESTES TESTES PRECISAM DO INFLUXDB

      it('success - transfer data', async () => {
        const deviceId = new Types.ObjectId(
          '640667dd2d824a3ec7cde788',
        ).toString();

        //Tem que ser idêntico ao banco local
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
        const mockDeviceGBStub = deviceGBStub(deviceId);

        const mockBucketStub = bucketStubs(
          bucketId,
          bucketDtoStubs({
            clientId: mockUcsStub.clientId.toString(),
            influxConnectionId: influxConnectionCreated.insertedId.toString(),
          }),
        );

        await dbConnection
          .collection('clients')
          .insertOne(clientStub(mockUcsStub.clientId.toString()));
        await dbConnection.collection('ucs').insertOne(mockUcsStub);
        await dbConnection.collection('devices').insertOne(mockDeviceGBStub);
        await dbConnection.collection('buckets').insertOne(mockBucketStub);

        const axiosPostSpy = jest.spyOn(axios, 'post');
        const deviceGBSpy = jest.spyOn(DevicesGbService.prototype, 'create');

        const newDevice: CreateDevicesGbDto = {
          clientId: mockUcsStub.clientId.toString(),
          devId: `ucd-${mockUcsStub.ucCode}`,
          bucketId: mockBucketStub._id.toString(),
          name: `UC ${mockUcsStub.ucCode} desativada`,
          allows: mockDeviceGBStub.allows,
          communication: 'PIMA',
          type: 'LoRa',
          databaseId: expect.any(String),
        };

        const response = await request(httpServer)
          .put(`/ucs/disable/${mockUcsStub._id}`)
          .set('Authorization', token);

        expect(deviceGBSpy).toHaveBeenCalledWith(newDevice, expect.anything());
        expect(axiosPostSpy).toHaveBeenCalledWith(
          `${influxConnectionStub.host}/api/v2/query`,
          queryGetAllDataByDevId({
            bucketName: mockBucketStub.name,
            devId: mockDeviceGBStub.devId,
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
        deviceGBSpy.mockRestore();
      });

      it('success - transfer data & remove data', async () => {
        const deviceId = new Types.ObjectId(
          '640667dd2d824a3ec7cde788',
        ).toString();

        //Tem que ser idêntico ao banco local
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
        const mockDeviceGBStub = deviceGBStub(deviceId);

        const mockBucketStub = bucketStubs(
          bucketId,
          bucketDtoStubs({
            clientId: mockUcsStub.clientId.toString(),
            influxConnectionId: influxConnectionCreated.insertedId.toString(),
          }),
        );

        await dbConnection
          .collection('clients')
          .insertOne(clientStub(mockUcsStub.clientId.toString()));
        await dbConnection.collection('ucs').insertOne(mockUcsStub);
        await dbConnection.collection('devices').insertOne(mockDeviceGBStub);
        await dbConnection.collection('buckets').insertOne(mockBucketStub);

        const axiosPostSpy = jest.spyOn(axios, 'post');
        const deviceGBSpy = jest.spyOn(DevicesGbService.prototype, 'create');

        const newDevice: CreateDevicesGbDto = {
          clientId: mockUcsStub.clientId.toString(),
          devId: `ucd-${mockUcsStub.ucCode}`,
          bucketId: mockBucketStub._id.toString(),
          name: `UC ${mockUcsStub.ucCode} desativada`,
          allows: mockDeviceGBStub.allows,
          communication: 'PIMA',
          type: 'LoRa',
          databaseId: expect.any(String),
        };

        const response = await request(httpServer)
          .put(`/ucs/disable/${mockUcsStub._id}`)
          .send({ deleteData: true })
          .set('Authorization', token);

        expect(deviceGBSpy).toHaveBeenCalledWith(newDevice, expect.anything());
        expect(axiosPostSpy).toHaveBeenNthCalledWith(
          1,
          `${influxConnectionStub.host}/api/v2/query`,
          queryGetAllDataByDevId({
            bucketName: mockBucketStub.name,
            devId: mockDeviceGBStub.devId,
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
            predicate: `"dev_id" = "${mockDeviceGBStub.devId}"`,
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
        deviceGBSpy.mockRestore();
      });
    });

    describe('should be able to change device', () => {
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
        const ucDevice = deviceGBStub(deviceId);
        const deviceToChange = deviceGBStub(deviceId2, {
          devId: 'teste2',
          applicationId,
        });

        const mockBucketStub = bucketStubs(
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
        await dbConnection.collection('devices').insertOne(ucDevice);
        await dbConnection.collection('devices').insertOne(deviceToChange);
        await dbConnection.collection('applications').insertOne(application);
        await dbConnection.collection('buckets').insertOne(mockBucketStub);

        const axiosPostSpy = jest.spyOn(axios, 'post');
        const deviceGBSpy = jest.spyOn(DevicesGbService.prototype, 'create');

        const dev_eui = '123456';

        //Unfortunately we need mock this :/
        const TtnServiceSpy = jest.spyOn(TtnService, 'get');

        TtnServiceSpy.mockResolvedValue({
          data: {
            ids: { dev_eui },
          },
        });

        const response = await request(httpServer)
          .put(`/ucs/change-device/${mockUcsStub._id}`)
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
            devId: ucDevice.devId,
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
        deviceGBSpy.mockRestore();
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
        const ucDevice = deviceGBStub(deviceId);
        const deviceToChange = deviceGBStub(deviceId2, {
          devId: 'teste2',
          applicationId,
        });

        const mockBucketStub = bucketStubs(
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
        await dbConnection.collection('devices').insertOne(ucDevice);
        await dbConnection.collection('devices').insertOne(deviceToChange);
        await dbConnection.collection('applications').insertOne(application);
        await dbConnection.collection('buckets').insertOne(mockBucketStub);

        const axiosPostSpy = jest.spyOn(axios, 'post');
        const deviceGBSpy = jest.spyOn(DevicesGbService.prototype, 'create');

        const dev_eui = '123456';

        //Unfortunately we need mock this :/
        const TtnServiceSpy = jest.spyOn(TtnService, 'get');

        TtnServiceSpy.mockResolvedValue({
          data: {
            ids: { dev_eui },
          },
        });

        const response = await request(httpServer)
          .put(`/ucs/change-device/${mockUcsStub._id}`)
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
            devId: ucDevice.devId,
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
            predicate: `"dev_id" = "${ucDevice.devId}"`,
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
        deviceGBSpy.mockRestore();
        TtnServiceSpy.mockRestore();
      });
    });

    it('should be able to delete a uc', async () => {
      const mockUcsStub = ucStubs(ucDtoStubs());

      await dbConnection.collection('ucs').insertOne(mockUcsStub);

      const response = await request(httpServer)
        .delete(`/ucs/${mockUcsStub._id}`)
        .set('Authorization', token);

      expect(response.status).toBe(200);
    });

    it('should be able to delete many a ucs', async () => {
      const mockUcStub1 = ucStubs(
        ucDtoStubs({
          ucCode: '789',
          deviceId: new Types.ObjectId().toString(),
        }),
      );
      const mockUcStub2 = ucStubs(
        ucDtoStubs({ ucCode: '456' }),
        '63e53e35be706a6dabdd4000',
      );

      await dbConnection.collection('ucs').insertOne(mockUcStub1);
      await dbConnection.collection('ucs').insertOne(mockUcStub2);

      const response = await request(httpServer)
        .delete(`/ucs/many/${mockUcStub1._id},${mockUcStub2._id}`)
        .set('Authorization', token);

      expect(response.status).toBe(200);
    });

    it('should be able to find a uc by code', async () => {
      const mockUcsStub = ucStubs(ucDtoStubs());
      await dbConnection.collection('ucs').insertOne(mockUcsStub);

      await dbConnection
        .collection('transformers')
        .insertOne(transformerStubs('3'));

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/details/ucCode/${mockUcsStub.ucCode}`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.ucCode).toEqual(mockUcsStub.ucCode);
    });

    it('should return 401 Forbidden if not authorized', async () => {
      const mockUcsStub = ucStubs(ucDtoStubs());
      await dbConnection.collection('ucs').insertOne(mockUcsStub);

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/details/ucCode/${mockUcsStub.ucCode}`,
          ),
        )
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });

    it('should return lastReceived TUSD-G', async () => {
      const lastReceivedList = {
        _id: new Types.ObjectId(),
        deviceId: '64de14f276116100688740d1',
        port: 6,
        package: {
          port: 6,
          peak_demand_consumed: 1111,
          peak_demand_generated: 0,
          offpeak_demand_consumed: 985,
          offpeak_demand_generated: 444,
          cable_status: 1,
        },
        receivedAt: '2023-09-29T12:59:03.085Z',
      };

      await dbConnection
        .collection('lastreceiveds')
        .insertOne(lastReceivedList);

      const mockUcsStub = {
        ucCode: '222',
        deviceId: '64de14f276116100688740d1',
      };

      await dbConnection.collection('ucs').insertOne(mockUcsStub);

      const response = await request(httpServer)
        .get(`/ucs/details/ucCode/${mockUcsStub.ucCode}`)
        .set('Authorization', token);

      const lastReceived = response.body.lastReceived.find(
        (item) => item.package.port === 6,
      );

      expect(lastReceived.package.offpeak_demand_consumed).toBe(985);
      expect(lastReceived.package.offpeak_demand_generated).toBe(444);
      expect(lastReceived.package.peak_demand_consumed).toBe(1111);
      expect(lastReceived.package.peak_demand_generated).toBe(0);
    });

    it('should be able to create many ucs', async () => {
      const mockUcCsvStub = ucCsvStub();

      const response = await request(httpServer)
        .post(`/ucs/many`)
        .send([mockUcCsvStub])
        .set('Authorization', token);

      expect(response.status).toBe(201);
      expect(response.body[0]._id).toBeDefined();
    });

    afterAll(async () => {
      await dbConnection
        .collection('users')
        .deleteOne({ username: createUserDto.username });

      await dbConnection.collection('ucs').deleteMany({});
      await dbConnection.collection('lastreceiveds').deleteMany({});
      await dbConnection.collection('devices').deleteMany({});
      await dbConnection.collection('clients').deleteMany({});
      await dbConnection.collection('buckets').deleteMany({});
      await dbConnection.collection('influxconnections').deleteMany({});
      await dbConnection.collection('offlinealertjobs').deleteMany({});
      await dbConnection.collection('applications').deleteMany({});
      await dbConnection.collection('transformers').deleteMany({});
    });
  });

  describe('User - Commercial', () => {
    let token: string;
    let createdUser: SanitizeUser;
    const createUserDto: CreateUserDto = userDTOStub({
      accessLevel: Role.ADMIN,
      username: 'commercial@test.com',
    });

    beforeAll(async () => {
      createdUser = await userService.create(createUserDto);
      responseAuthenticate = await request(httpServer).post('/login').send({
        username: createUserDto.username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    beforeEach(async () => {
      await dbConnection
        .collection('ucs')
        .deleteMany({ routeCode: ucDtoStubs().routeCode });

      await dbConnection.collection('ucs').deleteMany({});
      await dbConnection.collection('devices').deleteMany({});
      await dbConnection.collection('clients').deleteMany({});
      await dbConnection.collection('buckets').deleteMany({});
      await dbConnection.collection('influxconnections').deleteMany({});
      await dbConnection.collection('offlinealertjobs').deleteMany({});
      await dbConnection.collection('applications').deleteMany({});
      await dbConnection.collection('transformers').deleteMany({});
    });

    const createUcDevicesAndClientsAndUCSWithoutDevices = async () => {
      const ownUcs = ucStubs(ucDtoStubs({ clientId: createUserDto.clientId }));

      const client = clientStub(createUserDto.clientId.toString());
      const otherClient = clientStub(new Types.ObjectId().toString());
      const childClient = clientStub(new Types.ObjectId().toString(), {
        parentId: client._id,
      });

      const ucs = [];
      const ucsWithoutDevices = [];
      const devices = [];
      const activeDevices = [];

      const ownActiveDevice = {
        _id: new Types.ObjectId(),
        devId: `active-${new Types.ObjectId()}`,
        allows: ['quality'],
        clientId: client._id,
        type: 'LoRa',
      };

      const childActiveDevice = {
        _id: new Types.ObjectId(),
        devId: `active-${new Types.ObjectId()}`,
        allows: ['quality'],
        clientId: childClient._id,
        type: 'LoRa',
      };

      const ownInactiveDevice = {
        _id: new Types.ObjectId(),
        devId: `ucd-${new Types.ObjectId()}`,
        allows: ['quality'],
        clientId: client._id,
        type: 'LoRa',
      };

      const childInactiveDevice = {
        _id: new Types.ObjectId(),
        devId: `ucd-${new Types.ObjectId()}`,
        allows: ['quality'],
        clientId: childClient._id,
        type: 'LoRa',
      };

      const otherActiveDevice = {
        _id: new Types.ObjectId(),
        devId: `active-${new Types.ObjectId()}`,
        allows: ['quality'],
        clientId: otherClient._id,
        type: 'LoRa',
      };

      devices.push(childInactiveDevice);
      devices.push(childActiveDevice);
      devices.push(otherActiveDevice);
      devices.push(ownInactiveDevice);
      devices.push(ownActiveDevice);

      for (let i = 0; i < devices.length; i++) {
        ucs.push({
          ...ownUcs,
          _id: new Types.ObjectId(),
          deviceId: devices[i]._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: devices[i].clientId,
        });
      }

      const childUcWithoutDevice = {
        ...ownUcs,
        _id: new Types.ObjectId(),
        transformerId: new Types.ObjectId().toString(),
        ucCode: new Types.ObjectId().toString(),
        deviceId: null,
        clientId: childClient._id,
      };

      ucs.push(childUcWithoutDevice);

      await dbConnection.collection('devices').insertMany(devices);
      await dbConnection.collection('ucs').insertMany(ucs);
      await dbConnection.collection('clients').insertOne(client);
      await dbConnection.collection('clients').insertOne(otherClient);
      await dbConnection.collection('clients').insertOne(childClient);

      return {
        client,
        otherClient,
        childClient,
        devices,
        ucsWithoutDevices,
        ucs,
        activeDevices,
      };
    };

    it(`should be able to return all ucs (2 active e 1 device=null) using filter deviceId.devId=Ativada`, async () => {
      const { childClient: childClientClient, client } =
        await createUcDevicesAndClientsAndUCSWithoutDevices();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/paginate?filter[0][deviceId.devId][0]=Ativada`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(3);

      const everyUcIsFromAllClients = response.body.data.every(
        (uc) =>
          uc.clientId._id === client._id.toString() ||
          uc.clientId._id === childClientClient._id.toString(),
      );

      const reg = /^(?!ucd)/;

      const everyUcIsActiveOrNull = response.body.data.every(
        (uc) =>
          uc.deviceId === null || (uc.deviceId.devId as string).match(reg),
      );

      expect(everyUcIsFromAllClients).toBeTruthy();
      expect(everyUcIsActiveOrNull).toBeTruthy();
    });

    it('should be able to upload csv', async () => {
      const imageName = 'test.csv';

      const clientId = '12456';

      const it = '3';
      const transformer = await dbConnection
        .collection('transformers')
        .insertOne(transformerStubs(it));

      const response = await request(httpServer)
        .post(generateRandomQueryParams(`/ucs/upload`))
        .set('Content-Type', 'multipart/form-data')
        .attach('file', file().buffer, imageName)
        .field('clientId', '12456')
        .set('Authorization', token);

      expect(response.status).toBe(201);

      for (const uc of response.body) {
        expect(uc.operation).toBeDefined();
        expect(['Editar', 'Inserir'].includes(uc.operation)).toBe(true);
        expect(uc.clientId).toBe(clientId);
        expect(uc.transformerId).toBe(transformer.insertedId.toString());
        expect(uc.transformer).toBe(it);
        expect(uc.ucCode).toBeDefined();
        expect(JSON.stringify(uc.location)).toBe(
          JSON.stringify({
            type: 'Point',
            coordinates: [-52.00259612357232, -28.06239175648157],
          }),
        );
        expect(uc.ucNumber).toBeDefined();
        expect(uc.ucClass).toBeDefined();
        expect(uc.subClass).toBeDefined();
        expect(uc.billingGroup).toBeDefined();
        expect(uc.group).toBeDefined();
        expect(uc.routeCode).toBeDefined();
        expect(uc.timeZone).toBeDefined();
        expect(uc.sequence).toBeDefined();
        expect(uc.phases).toBeDefined();
        expect(uc.circuitBreaker).toBeDefined();
        expect(uc.circuitBreaker).toBeDefined();
      }
    });

    it('should be able to get an error in uploading the file', async () => {
      const imageName = 'test.csv';

      const it = '3';
      await dbConnection
        .collection('transformers')
        .insertOne(transformerStubs(it));

      const response = await request(httpServer)
        .post(generateRandomQueryParams(`/ucs/upload`))
        .set('Content-Type', 'multipart/form-data')
        .attach('file', file().buffer, imageName)
        .field('clientId1', '12456')
        .set('Authorization', token);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('ClientId é obrigatório.');
    });

    it('Should not accept any other file type than csv', async () => {
      const imageName = 'test.txt';

      const response = await request(httpServer)
        .post(generateRandomQueryParams(`/ucs/upload`))
        .set('Content-Type', 'multipart/form-data')
        .attach('file', file().buffer, imageName)
        .field('clientId', '12456')
        .set('Authorization', token);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'O arquivo deve ter uma extensão válida: csv.',
      );
    });

    const createToParents = ({
      parentTransformers,
      parentDevices,
      parentUcs,
      mockUcsStub,
    }) => {
      for (let i = 0; i < 2; i++) {
        const device = {
          _id: new Types.ObjectId(),
          devId: `teste-${new Types.ObjectId()}`,
          allows: ['quality'],
          type: 'LoRa',
          clientId: new Types.ObjectId(mockUcsStub.clientId as string),
        };

        const transformer = {
          _id: new Types.ObjectId(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
          it: new Types.ObjectId().toString(),
        };

        parentTransformers.push(transformer);

        parentDevices.push(device);

        parentUcs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: device._id,
          transformerId: transformer._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
        });
      }
    };

    const createToChildren = ({
      childTransformers,
      childDevices,
      childUcs,
      childClient,
      mockUcsStub,
    }) => {
      for (let i = 0; i < 2; i++) {
        const device = {
          _id: new Types.ObjectId(),
          devId: `teste-${new Types.ObjectId()}`,
          allows: ['quality'],
          type: 'LoRa',
          clientId: childClient._id,
        };

        const transformer = {
          _id: new Types.ObjectId(),
          clientId: childClient._id,
          it: new Types.ObjectId().toString(),
        };

        childTransformers.push(transformer);

        childDevices.push(device);

        childUcs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: device._id,
          transformerId: transformer._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: childClient._id,
        });
      }
    };

    const createToRandomClient = ({
      randomTransformers,
      randomDevices,
      randomUcs,
      randomClient,
      mockUcsStub,
    }) => {
      for (let i = 0; i < 3; i++) {
        const device = {
          _id: new Types.ObjectId(),
          devId: `teste-${new Types.ObjectId()}`,
          allows: ['quality'],
          type: 'LoRa',
          clientId: randomClient._id,
        };

        const transformer = {
          _id: new Types.ObjectId(),
          clientId: randomClient._id,
          it: new Types.ObjectId().toString(),
        };

        randomTransformers.push(transformer);

        randomDevices.push(device);

        randomUcs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: device._id,
          transformerId: transformer._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: randomClient._id,
        });
      }
    };

    const createUcDevicesAndClients = async () => {
      const mockUcsStub = ucStubs(
        ucDtoStubs({ clientId: createUserDto.clientId }),
      );

      const parentClient = {
        ...clientStub(createUserDto.clientId.toString()),
        name: 'parent',
      };

      const childClient = {
        ...clientStub(new Types.ObjectId().toString()),
        name: 'child',
        parentId: parentClient._id,
      };

      const randomClient = {
        ...clientStub(new Types.ObjectId().toString()),
        name: 'random',
      };

      const randomUcs = [];
      const parentUcs = [];
      const childUcs = [];

      const randomDevices = [];
      const parentDevices = [];
      const childDevices = [];

      const parentTransformers = [];
      const childTransformers = [];
      const randomTransformers = [];

      createToParents({
        mockUcsStub,
        parentDevices,
        parentTransformers,
        parentUcs,
      });
      createToChildren({
        mockUcsStub,
        childClient,
        childDevices,
        childTransformers,
        childUcs,
      });
      createToRandomClient({
        mockUcsStub,
        randomClient,
        randomDevices,
        randomTransformers,
        randomUcs,
      });

      const randomChildDevice = {
        devId: `ucd-${new Types.ObjectId()}`,
        _id: new Types.ObjectId(),
        allows: ['measurements', 'faults'],
        type: 'GSM',
        clientId: childClient._id,
      };

      childDevices.push(randomChildDevice);

      const randomChildTransformer = {
        _id: new Types.ObjectId(),
        clientId: childClient._id,
        it: new Types.ObjectId().toString(),
      };

      childTransformers.push(randomChildTransformer);

      childUcs.push({
        ...mockUcsStub,
        _id: new Types.ObjectId(),
        deviceId: randomChildDevice._id,
        transformerId: randomChildTransformer._id,
        ucCode: new Types.ObjectId().toString(),
        clientId: childClient._id,
      });

      Promise.all([
        await dbConnection
          .collection('transformers')
          .insertMany([
            ...parentTransformers,
            ...childTransformers,
            ...randomTransformers,
          ]),
        await dbConnection
          .collection('devices')
          .insertMany([...parentDevices, ...childDevices, ...randomDevices]),
        await dbConnection
          .collection('ucs')
          .insertMany([...parentUcs, ...childUcs, ...randomUcs]),
        await dbConnection.collection('clients').insertOne(parentClient),
        await dbConnection.collection('clients').insertOne(childClient),
        await dbConnection.collection('clients').insertOne(randomClient),
      ]);

      return {
        parentClient,
        childClient,
        randomClient,
        parentDevices,
        childDevices,
        randomDevices,
        parentUcs,
        childUcs,
        randomUcs,
        parentTransformers,
        childTransformers,
        randomTransformers,
      };
    };

    it(`should be able to return all ucs`, async () => {
      const { childUcs, parentUcs, childClient } =
        await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/ucs'))
        .set('Authorization', token);

      expect(response.body.length).toBe(childUcs.length + parentUcs.length);
      expect(response.status).toBe(200);

      for (const uc of response.body) {
        expect(
          [
            createdUser.clientId.toString(),
            childClient._id.toString(),
          ].includes(uc.clientId._id),
        ).toBeTruthy();
      }

      expect(response.body[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs by allows=measurements`, async () => {
      const { parentDevices, childDevices, childClient } =
        await createUcDevicesAndClients();

      const measurementsParentDevice = childDevices.filter((device) =>
        device.allows.includes('measurements'),
      );

      const measurementsChildDevice = parentDevices.filter((device) =>
        device.allows.includes('measurements'),
      );

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/ucs?allows=measurements'))
        .set('Authorization', token);

      for (const uc of response.body) {
        expect(
          [
            createdUser.clientId.toString(),
            childClient._id.toString(),
          ].includes(uc.clientId._id),
        ).toBeTruthy();
        expect(uc.deviceId.allows.includes('measurements')).toBeTruthy();
      }

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        measurementsChildDevice.length + measurementsParentDevice.length,
      );
      expect(response.body[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs by allows=quality & deviceType=LoRa`, async () => {
      const { parentDevices, childDevices, childClient } =
        await createUcDevicesAndClients();

      const childQualityAndLoraDevice = childDevices.filter(
        (device) => device.allows.includes('quality') && device.type === 'LoRa',
      );

      const parentQualityAndLoraDevice = parentDevices.filter(
        (device) => (device) =>
          device.allows.includes('quality') && device.type === 'LoRa',
      );

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/ucs?allows=quality&deviceType=LoRa'))
        .set('Authorization', token);

      for (const uc of response.body) {
        expect(
          [
            createdUser.clientId.toString(),
            childClient._id.toString(),
          ].includes(uc.clientId._id),
        ).toBeTruthy();
        expect(uc.deviceId.allows.includes('quality')).toBeTruthy();
        expect(uc.deviceId.type).toBe('LoRa');
      }

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        childQualityAndLoraDevice.length + parentQualityAndLoraDevice.length,
      );
      expect(response.body[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs by transformerId from children`, async () => {
      const { childTransformers, childClient } =
        await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs?transformerId=${childTransformers[0]._id.toString()}`,
          ),
        )
        .set('Authorization', token);

      for (const uc of response.body) {
        expect(uc.clientId._id).toBe(childClient._id.toString());
        expect(uc.deviceId._id).toBeDefined();
      }

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });

    afterAll(async () => {
      await dbConnection
        .collection('users')
        .deleteOne({ username: createUserDto.username });

      await dbConnection.collection('transformers').deleteMany({});
      await dbConnection.collection('ucs').deleteMany({});
      await dbConnection.collection('devices').deleteMany({});
      await dbConnection.collection('clients').deleteMany({});
      await dbConnection.collection('buckets').deleteMany({});
      await dbConnection.collection('influxconnections').deleteMany({});
      await dbConnection.collection('offlinealertjobs').deleteMany({});
      await dbConnection.collection('applications').deleteMany({});
      await dbConnection.collection('transformers').deleteMany({});
    });
  });

  describe('User - Role.Viewer', () => {
    let token: string;
    let createdUser: SanitizeUser;
    const createUserDto: CreateUserDto = userDTOStub({
      accessLevel: Role.VIEWER,
      username: 'viewer@test.com',
    });

    beforeAll(async () => {
      createdUser = await userService.create(createUserDto);
      responseAuthenticate = await request(httpServer).post('/login').send({
        username: createUserDto.username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    beforeEach(async () => {
      await dbConnection
        .collection('ucs')
        .deleteMany({ routeCode: ucDtoStubs().routeCode });

      await dbConnection.collection('ucs').deleteMany({});
      await dbConnection.collection('devices').deleteMany({});
      await dbConnection.collection('clients').deleteMany({});
      await dbConnection.collection('buckets').deleteMany({});
      await dbConnection.collection('influxconnections').deleteMany({});
      await dbConnection.collection('offlinealertjobs').deleteMany({});
      await dbConnection.collection('applications').deleteMany({});
      await dbConnection.collection('transformers').deleteMany({});
    });

    const createUcDevicesAndClientsAndUCSWithoutDevices = async () => {
      const ownUcs = ucStubs(ucDtoStubs({ clientId: createUserDto.clientId }));

      const client = clientStub(createUserDto.clientId.toString());
      const otherClient = clientStub(new Types.ObjectId().toString());

      const ucs = [];
      const ucsWithoutDevices = [];
      const devices = [];
      const activeDevices = [];

      const ownActiveDevice = {
        _id: new Types.ObjectId(),
        devId: `active-${new Types.ObjectId()}`,
        allows: ['quality'],
        clientId: client._id,
        type: 'LoRa',
      };

      const ownInactiveDevice = {
        _id: new Types.ObjectId(),
        devId: `ucd-${new Types.ObjectId()}`,
        allows: ['quality'],
        clientId: client._id,
        type: 'LoRa',
      };

      const otherActiveDevice = {
        _id: new Types.ObjectId(),
        devId: `active-${new Types.ObjectId()}`,
        allows: ['quality'],
        clientId: otherClient._id,
        type: 'LoRa',
      };

      devices.push(otherActiveDevice);
      devices.push(ownInactiveDevice);
      devices.push(ownActiveDevice);

      for (let i = 0; i < devices.length; i++) {
        ucs.push({
          ...ownUcs,
          _id: new Types.ObjectId(),
          deviceId: devices[i]._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: devices[i].clientId,
        });
      }

      const ownUcWithoutDevice = {
        ...ownUcs,
        _id: new Types.ObjectId(),
        transformerId: new Types.ObjectId().toString(),
        ucCode: new Types.ObjectId().toString(),
        deviceId: null,
        clientId: client._id,
      };

      ucs.push(ownUcWithoutDevice);

      await dbConnection.collection('devices').insertMany(devices);
      await dbConnection.collection('ucs').insertMany(ucs);
      await dbConnection.collection('clients').insertOne(client);
      await dbConnection.collection('clients').insertOne(otherClient);

      return {
        client,
        otherClient,
        devices,
        ucsWithoutDevices,
        ucs,
        activeDevices,
      };
    };

    it(`should be able to return all ucs (1 active e 1 device=null) using filter deviceId.devId=Ativadad`, async () => {
      const { client } = await createUcDevicesAndClientsAndUCSWithoutDevices();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/paginate?filter[0][deviceId.devId][0]=Ativada`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);

      const everyUcIsFromClients = response.body.data.every(
        (uc) => uc.clientId._id === client._id.toString(),
      );

      const reg = /^(?!ucd)/;

      const everyUcIsActiveOrNull = response.body.data.every(
        (uc) =>
          uc.deviceId === null || (uc.deviceId.devId as string).match(reg),
      );

      expect(everyUcIsFromClients).toBeTruthy();
      expect(everyUcIsActiveOrNull).toBeTruthy();
    });

    const createUcDevicesAndClients = async () => {
      const mockUcsStub = ucStubs(
        ucDtoStubs({ clientId: createUserDto.clientId }),
      );

      const client = clientStub(createUserDto.clientId.toString());
      const otherClient = clientStub(new Types.ObjectId().toString());

      const ucs = [];
      const devices = [];
      const managerTransformers = [];
      const transformers = [];

      for (let i = 0; i < 4; i++) {
        managerTransformers.push({
          _id: new Types.ObjectId(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
          it: new Types.ObjectId().toString(),
        });
      }

      for (let i = 0; i < 2; i++) {
        transformers.push({
          _id: new Types.ObjectId(),
          clientId: otherClient,
          it: new Types.ObjectId().toString(),
        });
      }

      for (let i = 0; i < 2; i++) {
        devices.push({
          _id: new Types.ObjectId(),
          devId: `teste-${new Types.ObjectId()}`,
          allows: ['quality'],
          type: 'LoRa',
        });
      }

      for (let i = 0; i < 2; i++) {
        devices.push({
          devId: `ucd-${new Types.ObjectId()}`,
          _id: new Types.ObjectId(),
          allows: ['measurements', 'faults'],
          type: 'GSM',
        });
      }

      for (let i = 0; i < 3; i++) {
        devices.push({
          devId: new Types.ObjectId().toString(),
          _id: new Types.ObjectId(),
          allows: ['measurements', 'faults', 'quality'],
          type: 'LoRa',
        });
      }

      const devicesTotal = devices.length; // 7
      const managerDevicesCount = 4;
      const randomDevicesCount = 3;

      for (let i = 0; i < managerDevicesCount; i++) {
        // 2 - quality 2 - measurements e 1 - faults
        // 2 - LoRa 2 e 2 - GSM
        devices[i].clientId = new Types.ObjectId(
          mockUcsStub.clientId as string,
        );

        ucs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: devices[i]._id,
          transformerId: managerTransformers[i]._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
        });
      }

      for (
        let i = managerDevicesCount;
        i < managerDevicesCount + randomDevicesCount;
        i++
      ) {
        devices[i].clientId = new Types.ObjectId(otherClient._id);

        // 2 - LoRa 2 e 2 - GSM
        // 3 // 3 - quality 3 - measurements e 3 - faults
        ucs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: devices[i]._id,
          transformerId: new Types.ObjectId().toString(),
          ucCode: new Types.ObjectId().toString(),
          clientId: otherClient._id,
        });
      }

      await dbConnection
        .collection('transformers')
        .insertMany([...managerTransformers, ...transformers]);
      await dbConnection.collection('devices').insertMany(devices);
      await dbConnection.collection('ucs').insertMany(ucs);
      await dbConnection.collection('clients').insertOne(client);
      await dbConnection.collection('clients').insertOne(otherClient);

      return {
        client,
        otherClient,
        devices,
        transformers,
        managerTransformers,
      };
    };

    it('Should not accept the request - Not Permission - ERROR 403', async () => {
      const imageName = 'test.txt';

      await dbConnection
        .collection('transformers')
        .insertOne(transformerStubs('3'));

      const response = await request(httpServer)
        .post(generateRandomQueryParams(`/ucs/upload`))
        .set('Content-Type', 'multipart/form-data')
        .attach('file', file().buffer, imageName)
        .field('clientId', '12456')
        .set('Authorization', token);

      expect(response.status).toBe(403);
    });

    it(`should be able to return all ucs`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/ucs'))
        .set('Authorization', token);

      for (const uc of response.body) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
      }

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
      expect(response.body[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs by allows=measurements`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/ucs?allows=measurements'))
        .set('Authorization', token);

      for (const uc of response.body) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
        expect(uc.deviceId.allows.includes('measurements')).toBeTruthy();
      }

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs by allows=measurements & deviceType=GSM`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams('/ucs?allows=measurements&deviceType=GSM'),
        )
        .set('Authorization', token);

      for (const uc of response.body) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
        expect(uc.deviceId.allows.includes('measurements')).toBeTruthy();
        expect(uc.deviceId.type).toBe('GSM');
      }

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs by allows=quality & deviceType=LoRa`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/ucs?allows=quality&deviceType=LoRa'))
        .set('Authorization', token);

      for (const uc of response.body) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
        expect(uc.deviceId.allows.includes('quality')).toBeTruthy();
        expect(uc.deviceId.type).toBe('LoRa');
      }

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs by allows=quality & deviceType=GSM`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/ucs?allows=quality&deviceType=GSM'))
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });

    afterAll(async () => {
      await dbConnection
        .collection('users')
        .deleteOne({ username: createUserDto.username });

      await dbConnection.collection('ucs').deleteMany({});
      await dbConnection.collection('devices').deleteMany({});
      await dbConnection.collection('clients').deleteMany({});
      await dbConnection.collection('buckets').deleteMany({});
      await dbConnection.collection('influxconnections').deleteMany({});
      await dbConnection.collection('offlinealertjobs').deleteMany({});
      await dbConnection.collection('applications').deleteMany({});
      await dbConnection.collection('transformers').deleteMany({});
    });
  });

  describe('User - Role.Manager', () => {
    let token: string;
    let createdUser: SanitizeUser;
    const createUserDto: CreateUserDto = userDTOStub({
      accessLevel: Role.MANAGER,
      username: 'manager@test.com',
    });

    beforeAll(async () => {
      createdUser = await userService.create(createUserDto);
      responseAuthenticate = await request(httpServer).post('/login').send({
        username: createUserDto.username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    beforeEach(async () => {
      await dbConnection
        .collection('ucs')
        .deleteMany({ routeCode: ucDtoStubs().routeCode });

      await dbConnection.collection('ucs').deleteMany({});
      await dbConnection.collection('devices').deleteMany({});
      await dbConnection.collection('clients').deleteMany({});
      await dbConnection.collection('buckets').deleteMany({});
      await dbConnection.collection('influxconnections').deleteMany({});
      await dbConnection.collection('offlinealertjobs').deleteMany({});
      await dbConnection.collection('applications').deleteMany({});
      await dbConnection.collection('transformers').deleteMany({});
    });

    const createUcDevicesAndClients = async () => {
      const mockUcsStub = ucStubs(
        ucDtoStubs({ clientId: createUserDto.clientId }),
      );

      const client = clientStub(createUserDto.clientId.toString());
      const otherClient = clientStub(new Types.ObjectId().toString());

      const ucs = [];
      const devices = [];
      const managerTransformers = [];
      const transformers = [];

      for (let i = 0; i < 4; i++) {
        managerTransformers.push({
          _id: new Types.ObjectId(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
          it: new Types.ObjectId().toString(),
        });
      }

      for (let i = 0; i < 2; i++) {
        transformers.push({
          _id: new Types.ObjectId(),
          clientId: otherClient,
          it: new Types.ObjectId().toString(),
        });
      }

      for (let i = 0; i < 2; i++) {
        devices.push({
          _id: new Types.ObjectId(),
          devId: `teste-${new Types.ObjectId()}`,
          allows: ['quality'],
          type: 'LoRa',
        });
      }

      for (let i = 0; i < 2; i++) {
        devices.push({
          devId: `ucd-${new Types.ObjectId()}`,
          _id: new Types.ObjectId(),
          allows: ['measurements', 'faults'],
          type: 'GSM',
        });
      }

      for (let i = 0; i < 3; i++) {
        devices.push({
          devId: new Types.ObjectId().toString(),
          _id: new Types.ObjectId(),
          allows: ['measurements', 'faults', 'quality'],
          type: 'LoRa',
        });
      }

      const devicesTotal = devices.length; // 7
      const managerDevicesCount = 4;
      const randomDevicesCount = 3;

      for (let i = 0; i < managerDevicesCount; i++) {
        // 2 - quality 2 - measurements e 1 - faults
        // 2 - LoRa 2 e 2 - GSM
        devices[i].clientId = new Types.ObjectId(
          mockUcsStub.clientId as string,
        );

        ucs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: devices[i]._id,
          transformerId: managerTransformers[i]._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
        });
      }

      for (
        let i = managerDevicesCount;
        i < managerDevicesCount + randomDevicesCount;
        i++
      ) {
        devices[i].clientId = new Types.ObjectId(otherClient._id);

        // 2 - LoRa 2 e 2 - GSM
        // 3 // 3 - quality 3 - measurements e 3 - faults
        ucs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: devices[i]._id,
          transformerId: new Types.ObjectId().toString(),
          ucCode: new Types.ObjectId().toString(),
          clientId: otherClient._id,
        });
      }

      await dbConnection
        .collection('transformers')
        .insertMany([...managerTransformers, ...transformers]);
      await dbConnection.collection('devices').insertMany(devices);
      await dbConnection.collection('ucs').insertMany(ucs);
      await dbConnection.collection('clients').insertOne(client);
      await dbConnection.collection('clients').insertOne(otherClient);

      return {
        client,
        otherClient,
        devices,
        transformers,
        managerTransformers,
      };
    };

    it('should be able to upload csv', async () => {
      const imageName = 'test.csv';

      const it = '3';

      const transformer = await dbConnection
        .collection('transformers')
        .insertOne(transformerStubs(it));

      const response = await request(httpServer)
        .post(generateRandomQueryParams(`/ucs/upload`))
        .set('Content-Type', 'multipart/form-data')
        .attach('file', file().buffer, imageName)
        .set('Authorization', token);

      expect(response.status).toBe(201);
      expect(response.body).toHaveLength(1);
      for (const uc of response.body) {
        expect(uc.operation).toBeDefined();
        expect(['Editar', 'Inserir'].includes(uc.operation)).toBe(true);
        expect(uc.clientId).toBe(createUserDto.clientId);
        expect(uc.transformerId).toBe(transformer.insertedId.toString());
        expect(uc.transformer).toBe(it);
        expect(uc.ucCode).toBeDefined();
        expect(JSON.stringify(uc.location)).toBe(
          JSON.stringify({
            type: 'Point',
            coordinates: [-52.00259612357232, -28.06239175648157],
          }),
        );
        expect(uc.ucNumber).toBeDefined();
        expect(uc.ucClass).toBeDefined();
        expect(uc.subClass).toBeDefined();
        expect(uc.billingGroup).toBeDefined();
        expect(uc.group).toBeDefined();
        expect(uc.routeCode).toBeDefined();
        expect(uc.timeZone).toBeDefined();
        expect(uc.sequence).toBeDefined();
        expect(uc.phases).toBeDefined();
        expect(uc.circuitBreaker).toBeDefined();
        expect(uc.circuitBreaker).toBeDefined();
      }
    });

    it('should be able operation=Editar in upload csv', async () => {
      const imageName = 'test.csv';

      const it = '3';

      const transformer = await dbConnection
        .collection('transformers')
        .insertOne(transformerStubs(it));

      await dbConnection
        .collection('ucs')
        .insertOne(ucDtoStubs({ ucCode: '65' }));

      const response = await request(httpServer)
        .post(generateRandomQueryParams(`/ucs/upload`))
        .set('Content-Type', 'multipart/form-data')
        .attach('file', file().buffer, imageName)
        .set('Authorization', token);

      expect(response.status).toBe(201);
      expect(response.body).toHaveLength(1);

      expect(response.body[0].operation).toBe('Editar');
    });

    it('should be able operation=Inserir in upload csv', async () => {
      const imageName = 'test.csv';

      const it = '3';

      await dbConnection
        .collection('transformers')
        .insertOne(transformerStubs(it));

      const response = await request(httpServer)
        .post(generateRandomQueryParams(`/ucs/upload`))
        .set('Content-Type', 'multipart/form-data')
        .attach('file', file().buffer, imageName)
        .set('Authorization', token);

      expect(response.status).toBe(201);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].operation).toBe('Inserir');
    });

    it('Should not accept any other file type than csv', async () => {
      const imageName = 'test.txt';

      const response = await request(httpServer)
        .post(generateRandomQueryParams(`/ucs/upload`))
        .set('Content-Type', 'multipart/form-data')
        .attach('file', file().buffer, imageName)
        .set('Authorization', token);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'O arquivo deve ter uma extensão válida: csv.',
      );
    });

    it(`should be able to return all ucs`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/ucs'))
        .set('Authorization', token);

      for (const uc of response.body) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
      }

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(4);
      expect(response.body[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs by allows=measurements`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/ucs?allows=measurements'))
        .set('Authorization', token);

      for (const uc of response.body) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
        expect(uc.deviceId.allows.includes('measurements')).toBeTruthy();
      }

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs by allows=measurements & deviceType=GSM`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams('/ucs?allows=measurements&deviceType=GSM'),
        )
        .set('Authorization', token);

      for (const uc of response.body) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
        expect(uc.deviceId.allows.includes('measurements')).toBeTruthy();
        expect(uc.deviceId.type).toBe('GSM');
      }

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs by allows=quality & deviceType=LoRa`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/ucs?allows=quality&deviceType=LoRa'))
        .set('Authorization', token);

      for (const uc of response.body) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
        expect(uc.deviceId.allows.includes('quality')).toBeTruthy();
        expect(uc.deviceId.type).toBe('LoRa');
      }

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs by allows=quality & deviceType=GSM`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(generateRandomQueryParams('/ucs?allows=quality&deviceType=GSM'))
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });

    it(`should be able to return all ucs by transformerId`, async () => {
      const { managerTransformers } = await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs?transformerId=${managerTransformers[0]._id.toString()}`,
          ),
        )
        .set('Authorization', token);

      for (const uc of response.body) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
        expect(uc.deviceId._id).toBeDefined();
      }

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });

    it(`shouldnt be able to return all ucs by transformerId`, async () => {
      const { transformers } = await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs?transformerId=${transformers[0]._id.toString()}`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });

    it(`should be able to return all ucs using filter clientId.name`, async () => {
      const { client } = await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/paginate?filter[0][clientId.name][0]=${client.name}`,
          ),
        )
        .set('Authorization', token);

      for (const uc of response.body.data) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
        expect(uc.deviceId._id).toBeDefined();
        expect(uc.transformerId._id).toBeDefined();
      }

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(4);
      expect(response.body.data[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs using filter deviceId.allows`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/paginate?filter[0][deviceId.allows][0]=quality&filter[0][deviceId.allows][1]=measurements`,
          ),
        )
        .set('Authorization', token);

      for (const uc of response.body.data) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
      }

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(4);
      expect(response.body.data[0]._id).toBeDefined();
    });

    it(`should be able to return all ucs using filter deviceId.devId=Ativada`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/paginate?filter[0][deviceId.devId][0]=Ativada`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
      const reg = /^(?!ucd)/;
      for (const uc of response.body.data) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
        expect(uc.deviceId.devId).toMatch(reg);
      }
    });

    it(`should be able to return all ucs using filter deviceId.devId=Desativada`, async () => {
      await createUcDevicesAndClients();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/paginate?filter[0][deviceId.devId][0]=Desativada`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);

      const reg = /^ucd/;
      for (const uc of response.body.data) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
        expect(uc.deviceId.devId).toMatch(reg);
      }
    });

    const createUcDevicesAndClientsAndUCSWithoutDevices = async () => {
      const mockUcsStub = ucStubs(
        ucDtoStubs({ clientId: createUserDto.clientId }),
      );

      const client = clientStub(createUserDto.clientId.toString());
      const otherClient = clientStub(new Types.ObjectId().toString());

      const ucs = [];
      const ucsWithoutDevices = [];
      const devices = [];
      const activeDevices = [];
      const managerTransformers = [];
      const transformers = [];

      for (let i = 0; i < 4; i++) {
        managerTransformers.push({
          _id: new Types.ObjectId(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
          it: new Types.ObjectId().toString(),
        });
      }

      for (let i = 0; i < 2; i++) {
        transformers.push({
          _id: new Types.ObjectId(),
          clientId: otherClient,
          it: new Types.ObjectId().toString(),
        });
      }

      for (let i = 0; i < 2; i++) {
        const device = {
          _id: new Types.ObjectId(),
          devId: `teste-${new Types.ObjectId()}`,
          allows: ['quality'],
          type: 'LoRa',
        };
        activeDevices.push(device);
        devices.push(device);
      }

      for (let i = 0; i < 2; i++) {
        devices.push({
          devId: `ucd-${new Types.ObjectId()}`,
          _id: new Types.ObjectId(),
          allows: ['measurements', 'faults'],
          type: 'GSM',
        });
      }

      for (let i = 0; i < 3; i++) {
        const device = {
          devId: new Types.ObjectId().toString(),
          _id: new Types.ObjectId(),
          allows: ['measurements', 'faults', 'quality'],
          type: 'LoRa',
        };
        activeDevices.push(device);
        devices.push(device);
      }

      const devicesTotal = devices.length; // 7
      const managerDevicesCount = 4;
      const randomDevicesCount = 3;

      for (let i = 0; i < managerDevicesCount; i++) {
        // 2 - quality 2 - measurements e 1 - faults
        // 2 - LoRa 2 e 2 - GSM
        devices[i].clientId = new Types.ObjectId(
          mockUcsStub.clientId as string,
        );

        ucs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: devices[i]._id,
          transformerId: managerTransformers[i]._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
        });
      }

      for (
        let i = managerDevicesCount;
        i < managerDevicesCount + randomDevicesCount;
        i++
      ) {
        devices[i].clientId = new Types.ObjectId(otherClient._id);

        // 2 - LoRa 2 e 2 - GSM
        // 3 // 3 - quality 3 - measurements e 3 - faults
        ucs.push({
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: devices[i]._id,
          transformerId: new Types.ObjectId().toString(),
          ucCode: new Types.ObjectId().toString(),
          clientId: otherClient._id,
        });
      }

      for (let i = 0; i < 1; i++) {
        const uc = {
          ...mockUcsStub,
          _id: new Types.ObjectId(),
          deviceId: null,
          transformerId: managerTransformers[i]._id,
          ucCode: new Types.ObjectId().toString(),
          clientId: new Types.ObjectId(mockUcsStub.clientId.toString()),
        };

        ucsWithoutDevices.push(uc);

        ucs.push(uc);
      }

      await dbConnection
        .collection('transformers')
        .insertMany([...managerTransformers, ...transformers]);
      await dbConnection.collection('devices').insertMany(devices);
      await dbConnection.collection('ucs').insertMany(ucs);
      await dbConnection.collection('clients').insertOne(client);
      await dbConnection.collection('clients').insertOne(otherClient);

      return {
        client,
        otherClient,
        devices,
        transformers,
        managerTransformers,
        ucsWithoutDevices,
        activeDevices,
      };
    };

    it(`should be able to return all ucs (2 active e 1 device=null) using filter deviceId.devId=Ativada & client_id`, async () => {
      await createUcDevicesAndClientsAndUCSWithoutDevices();

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/ucs/paginate?filter[0][deviceId.devId][0]=Ativada`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(3);

      const reg = /^(?!ucd)/;
      for (const uc of response.body.data) {
        expect(uc.clientId._id).toBe(createdUser.clientId.toString());
        if (uc.deviceId) {
          expect(uc.deviceId.devId).toMatch(reg);
        } else {
          expect(uc.deviceId).toBe(null);
        }
      }
    });

    afterAll(async () => {
      await dbConnection
        .collection('users')
        .deleteOne({ username: createUserDto.username });

      await dbConnection.collection('transformers').deleteMany({});
      await dbConnection.collection('ucs').deleteMany({});
      await dbConnection.collection('devices').deleteMany({});
      await dbConnection.collection('clients').deleteMany({});
      await dbConnection.collection('buckets').deleteMany({});
      await dbConnection.collection('influxconnections').deleteMany({});
      await dbConnection.collection('offlinealertjobs').deleteMany({});
      await dbConnection.collection('applications').deleteMany({});
      await dbConnection.collection('transformers').deleteMany({});
    });
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});

    await app.close();
  });
});
