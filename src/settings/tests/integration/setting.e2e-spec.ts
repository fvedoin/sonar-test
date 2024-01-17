import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userDTOStub } from '../../stubs/userDTO.stub';
import { settingStubs } from 'src/settings/stubs/setting.stub';
import { settingDtoStubs } from 'src/settings/stubs/settingDTO.stub';
import { clientStub } from 'src/settings/stubs/clientDTO.stub';
import { Role } from 'src/auth/models/Role';
import { generateRandomQueryParams } from 'src/utils/utils';
import { Client } from 'src/clients/entities/client.entity';

describe('Settings', () => {
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

  describe('Access with access level ADMIN', () => {
    let token;

    const username = 'role.admin';

    const createUserDto: CreateUserDto = {
      ...userDTOStub(),
      username,
      accessLevel: Role.ADMIN,
    };

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

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it('should be able to update a setting', async () => {
      const mockSettingStub = settingStubs(settingDtoStubs());
      await dbConnection.collection('settings').insertOne(mockSettingStub);

      const mockSettingStubUpdate = settingDtoStubs({
        precariousVoltageAbove: 'Updatedsetting',
      });

      const response = await request(httpServer)
        .put(`/settings/${mockSettingStub._id}`)
        .send(mockSettingStubUpdate)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.precariousVoltageAbove).toEqual(
        mockSettingStubUpdate.precariousVoltageAbove,
      );
    });

    it('should be able to delete a setting', async () => {
      const mockSettingStub = settingStubs(settingDtoStubs());
      await dbConnection.collection('settings').insertOne(mockSettingStub);

      const response = await request(httpServer)
        .delete(`/settings/${mockSettingStub._id}`)
        .set('Authorization', token);

      expect(response.status).toBe(200);
    });

    it(`should be able to return all 3 settings for sort (peakHourEnd) growing`, async () => {
      const settings = [];

      for (let i = 0; i < 3; i++) {
        const settingFromOtherClients = settingStubs(
          settingDtoStubs({
            clientId: new Types.ObjectId(),
          }),
        );

        settings.push(settingFromOtherClients);
      }

      const ownSetting = settingStubs(
        settingDtoStubs({
          clientId: createUserDto.clientId,
        }),
      );

      settings.push(ownSetting);

      await dbConnection.collection('settings').insertMany(settings);

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/settings?skip=0&limit=10&sort[peakHourEnd]=1&searchText=`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(4);
    });

    afterEach(async () => {
      await dbConnection.collection('settings').deleteMany({});
    });
  });

  describe('Access with access level Commercial', () => {
    let token;
    const username = 'role.commercial';

    const createUserDto: CreateUserDto = {
      ...userDTOStub(),
      username,
      accessLevel: Role.ADMIN,
    };

    beforeAll(async () => {
      await userService.create(createUserDto);

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it('should be able to update a setting', async () => {
      const mockSettingStub = settingStubs(settingDtoStubs());
      await dbConnection.collection('settings').insertOne(mockSettingStub);

      const mockSettingStubUpdate = settingDtoStubs({
        precariousVoltageAbove: 'Updatedsetting',
      });

      const response = await request(httpServer)
        .put(`/settings/${mockSettingStub._id}`)
        .send(mockSettingStubUpdate)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.precariousVoltageAbove).toEqual(
        mockSettingStubUpdate.precariousVoltageAbove,
      );
    });

    it('should be able to delete a setting', async () => {
      const mockSettingStub = settingStubs(settingDtoStubs());
      await dbConnection.collection('settings').insertOne(mockSettingStub);

      const response = await request(httpServer)
        .delete(`/settings/${mockSettingStub._id}`)
        .set('Authorization', token);

      expect(response.status).toBe(200);
    });

    const generateChildAndParentClient = () => {
      const childClientId = new Types.ObjectId().toString();

      const childClient: Client = {
        ...clientStub(childClientId),
        parentId: new Types.ObjectId(createUserDto.clientId),
      };

      const parentClient: Client = {
        ...clientStub(createUserDto.clientId),
      };

      return {
        childClient,
        parentClient,
      };
    };

    it(`should be able to return all 2 settings for sort (peakHourEnd) growing`, async () => {
      const settings = [];

      for (let i = 0; i < 3; i++) {
        const settingFromOtherClients = settingStubs(
          settingDtoStubs({
            clientId: new Types.ObjectId(),
          }),
        );

        settings.push(settingFromOtherClients);
      }

      const ownSetting = settingStubs(
        settingDtoStubs({
          clientId: new Types.ObjectId(createUserDto.clientId),
        }),
      );

      settings.push(ownSetting);

      const { childClient, parentClient } = generateChildAndParentClient();

      const childSetting = settingStubs(
        settingDtoStubs({
          clientId: childClient._id,
        }),
      );

      settings.push(childSetting);

      await dbConnection.collection('clients').insertOne(parentClient);
      await dbConnection.collection('clients').insertOne(childClient);

      await dbConnection.collection('settings').insertMany(settings);

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/settings?skip=0&limit=10&sort[peakHourEnd]=1&searchText=`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toEqual(2);
    });

    afterEach(async () => {
      await dbConnection.collection('settings').deleteMany({});
    });
  });

  describe('Access with access level VIEWER', () => {
    let token;
    const username = 'role.view';

    const createUserDto: CreateUserDto = {
      ...userDTOStub(),
      username,
      accessLevel: Role.VIEWER,
    };

    beforeAll(async () => {
      await userService.create(createUserDto);

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it('should not be able to update a setting - Not permission', async () => {
      const mockSettingStub = settingStubs(settingDtoStubs());
      await dbConnection.collection('settings').insertOne(mockSettingStub);

      const mockSettingStubUpdate = settingDtoStubs({
        precariousVoltageAbove: 'Updatedsetting',
      });

      const response = await request(httpServer)
        .put(`/settings/${mockSettingStub._id}`)
        .send(mockSettingStubUpdate)
        .set('Authorization', token);

      expect(response.status).toBe(403);
    });

    it('should tot be able to delete a setting - Not permission', async () => {
      const mockSettingStub = settingStubs(settingDtoStubs());
      await dbConnection.collection('settings').insertOne(mockSettingStub);

      const response = await request(httpServer)
        .delete(`/settings/${mockSettingStub._id}`)
        .set('Authorization', token);

      expect(response.status).toBe(403);
    });

    const generateChildAndParentClient = () => {
      const childClientId = new Types.ObjectId().toString();

      const childClient: Client = {
        ...clientStub(childClientId),
        parentId: new Types.ObjectId(createUserDto.clientId),
      };

      const parentClient: Client = {
        ...clientStub(createUserDto.clientId),
      };

      return {
        childClient,
        parentClient,
      };
    };

    it(`should not be able to return - Not permission`, async () => {
      const settings = [];

      for (let i = 0; i < 3; i++) {
        const settingFromOtherClients = settingStubs(
          settingDtoStubs({
            clientId: new Types.ObjectId(),
          }),
        );

        settings.push(settingFromOtherClients);
      }

      const ownSetting = settingStubs(
        settingDtoStubs({
          clientId: new Types.ObjectId(createUserDto.clientId),
        }),
      );

      settings.push(ownSetting);

      const { childClient, parentClient } = generateChildAndParentClient();

      const childSetting = settingStubs(
        settingDtoStubs({
          clientId: childClient._id,
        }),
      );

      settings.push(childSetting);

      await dbConnection.collection('clients').insertOne(parentClient);
      await dbConnection.collection('clients').insertOne(childClient);

      await dbConnection.collection('settings').insertMany(settings);

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/settings?skip=0&limit=10&sort[peakHourEnd]=1&searchText=`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(403);
    });

    afterEach(async () => {
      await dbConnection.collection('settings').deleteMany({});
    });
  });

  describe('Access with access level MANAGER', () => {
    let token;
    const username = 'role.MANAGER';

    const createUserDto: CreateUserDto = {
      ...userDTOStub(),
      username,
      accessLevel: Role.MANAGER,
    };

    beforeAll(async () => {
      await userService.create(createUserDto);

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it('should be able to update a setting', async () => {
      const mockSettingStub = settingStubs(settingDtoStubs());
      await dbConnection.collection('settings').insertOne(mockSettingStub);

      const mockSettingStubUpdate = settingDtoStubs({
        precariousVoltageAbove: 'Updatedsetting',
      });

      const response = await request(httpServer)
        .put(`/settings/${mockSettingStub._id}`)
        .send(mockSettingStubUpdate)
        .set('Authorization', token);

      expect(response.status).toBe(200);
    });

    it('should be able to delete a setting', async () => {
      const mockSettingStub = settingStubs(settingDtoStubs());
      await dbConnection.collection('settings').insertOne(mockSettingStub);

      const response = await request(httpServer)
        .delete(`/settings/${mockSettingStub._id}`)
        .set('Authorization', token);

      expect(response.status).toBe(403);
    });

    const generateChildAndParentClient = () => {
      const childClientId = new Types.ObjectId().toString();

      const childClient: Client = {
        ...clientStub(childClientId),
        parentId: new Types.ObjectId(createUserDto.clientId),
      };

      const parentClient: Client = {
        ...clientStub(createUserDto.clientId),
      };

      return {
        childClient,
        parentClient,
      };
    };

    it(`should be able to return 1`, async () => {
      const settings = [];

      for (let i = 0; i < 3; i++) {
        const settingFromOtherClients = settingStubs(
          settingDtoStubs({
            clientId: new Types.ObjectId(),
          }),
        );

        settings.push(settingFromOtherClients);
      }

      const ownSetting = settingStubs(
        settingDtoStubs({
          clientId: new Types.ObjectId(createUserDto.clientId),
        }),
      );

      settings.push(ownSetting);

      const { childClient, parentClient } = generateChildAndParentClient();

      const childSetting = settingStubs(
        settingDtoStubs({
          clientId: childClient._id,
        }),
      );

      settings.push(childSetting);

      await dbConnection.collection('clients').insertOne(parentClient);
      await dbConnection.collection('clients').insertOne(childClient);

      await dbConnection.collection('settings').insertMany(settings);

      const response = await request(httpServer)
        .get(
          generateRandomQueryParams(
            `/settings?skip=0&limit=10&sort[peakHourEnd]=1&searchText=`,
          ),
        )
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    afterEach(async () => {
      await dbConnection.collection('settings').deleteMany({});
    });
  });

  afterEach(async () => {
    await dbConnection.collection('settings').deleteMany({});
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('settings').deleteMany({});
    await dbConnection.collection('clients').deleteMany({});
    await app.close();
  });
});
