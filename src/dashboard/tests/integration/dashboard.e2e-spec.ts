import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userDTOStub } from '../../stubs/userDTO.stub';
import { clientStub } from 'src/dashboard/stubs/client.stub';
import { ucStub } from 'src/dashboard/stubs/uc.stub';
import { devicesStub } from 'src/dashboard/stubs/device.stub';
import { settingsStub } from 'src/dashboard/stubs/settings.stub';
import { lastReceivedStub } from 'src/dashboard/stubs/lastReceived.stub';

describe('Dashboard', () => {
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

  const clientId = new Types.ObjectId();

  it('lastHour', async () => {
    await dbConnection
      .collection('lastReceiveds')
      .insertOne(lastReceivedStub(devicesStub(clientId)._id));

    await dbConnection.collection('settings').insertOne(settingsStub(clientId));

    await dbConnection.collection('ucs').insertOne(ucStub(clientId));

    const response = await request(httpServer)
      .get(`/dashboard/${clientId}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.notifications).toBeDefined();
    expect(response.body.ucs).toBeDefined();
  });

  afterAll(async () => {
    await dbConnection.collection('clients').deleteOne({ _id: clientId });
    await dbConnection.collection('ucs').deleteOne({ clientId });
    await dbConnection.collection('devices').deleteOne({ clientId });
    await dbConnection.collection('settings').deleteOne({ clientId });
    await dbConnection
      .collection('lastReceiveds')
      .deleteOne({ deviceId: devicesStub(clientId)._id });
    await dbConnection
      .collection('users')
      .deleteOne({ username: userDTOStub().username });
    await app.close();
  });
});
