import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userDTOStub } from 'src/alert-gateway/stubs/userDTO.stub';
import { alertGatewayStubs } from 'src/alert-gateway/stubs/alertGateway.stub';
import { alertGatewayDtoStubs } from 'src/alert-gateway/stubs/alertGatewayDTO.stub';

describe('AlertGateway', () => {
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

  it('should be able to delete a alertGateway', async () => {
    const mockAlertGatewayStub = alertGatewayStubs(alertGatewayDtoStubs());

    await dbConnection
      .collection('alertgateways')
      .insertOne(mockAlertGatewayStub);

    const response = await request(httpServer)
      .delete(`/alert-gateway/${mockAlertGatewayStub._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
  });

  it('should return 400 when trying to delete a non-existent alertGateway', async () => {
    const nonExistentAlertGatewayId = 'nonexistentalertGatewayid';
    const response = await request(httpServer)
      .delete(`/alert-gateway/${nonExistentAlertGatewayId}`)
      .set('Authorization', token);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Não foi possível deletar os alertas de gateways!',
    );
  });

  it('should return 401 when trying to delete without authentication', async () => {
    const mockAlertGatewayStub = alertGatewayStubs(alertGatewayDtoStubs());
    await dbConnection
      .collection('alertgateways')
      .insertOne(mockAlertGatewayStub);

    const response = await request(httpServer).delete(
      `/alert-gateway/${mockAlertGatewayStub._id}`,
    );

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  afterAll(async () => {
    await dbConnection
      .collection('users')
      .deleteOne({ username: userDTOStub().username });
    await dbConnection.collection('alertgateways').deleteMany({});
    await app.close();
  });
});
