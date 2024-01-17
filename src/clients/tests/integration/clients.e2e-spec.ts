import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { clientStubs } from 'src/clients/stubs/client.stub';
import { clientDtoStubs } from 'src/clients/stubs/clientDTO.stub';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userDTOStub } from 'src/clients/stubs/userDTO.stub';
import { Role } from 'src/auth/models/Role';
import { generateRandomQueryParams } from 'src/utils/utils';

describe('Client', () => {
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

  it('should be able to create new client', async () => {
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

  it('should be able to create a client', async () => {
    const mockClientStub = clientDtoStubs();

    const response = await request(httpServer)
      .post(`/clients`)
      .send(mockClientStub)
      .set('Authorization', token);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(clientStubs(mockClientStub));
  });

  describe('Access with access level ADMIN', () => {
    let token;
    beforeAll(async () => {
      const createUserDto: CreateUserDto = userDTOStub();
      const username = 'role.admin';

      await userService.create({
        ...createUserDto,
        clientId: clientId.toString(),
        username,
        accessLevel: Role.SUPER_ADMIN,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should return clients filtered for Role.SUPER_ADMIN`, async () => {
      const response = await request(httpServer)
        .get(generateRandomQueryParams('/clients'))
        .set('Authorization', token);
      expect(response.body.length).toEqual(2);
    });
  });

  describe('Access with access level COMMERCIAL', () => {
    let token;
    beforeAll(async () => {
      const createUserDto: CreateUserDto = userDTOStub();
      const username = 'role.commercial';

      await userService.create({
        ...createUserDto,
        clientId: clientId.toString(),
        username,
        accessLevel: Role.ADMIN,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should return Clients filtered for Role.COMMERCIAL`, async () => {
      const response = await request(httpServer)
        .get(generateRandomQueryParams('/clients'))
        .set('Authorization', token);
      expect(response.body.length).toEqual(1);
    });
  });

  describe('Access with access level SUPPORT', () => {
    let token;
    beforeAll(async () => {
      const createUserDto: CreateUserDto = userDTOStub();
      const username = 'role.support';

      await userService.create({
        ...createUserDto,
        clientId: clientId.toString(),
        username,
        accessLevel: Role.SUPPORT,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should return clients filtered for Role.SUPPORT`, async () => {
      const response = await request(httpServer)
        .get(generateRandomQueryParams('/clients'))
        .set('Authorization', token);
      expect(response.body.length).toEqual(2);
    });
  });

  describe('Access with access level VIEWER', () => {
    let token;
    beforeAll(async () => {
      const createUserDto: CreateUserDto = userDTOStub();
      const username = 'role.viewer';

      await userService.create({
        ...createUserDto,
        clientId: clientId.toString(),
        username,
        accessLevel: Role.VIEWER,
      });

      responseAuthenticate = await request(httpServer).post('/login').send({
        username,
        password: createUserDto.password,
      });

      token = `Bearer ${responseAuthenticate.body.access_token}`;
    });

    it(`should return clients filtered for Role.VIEWER`, async () => {
      const response = await request(httpServer)
        .get(generateRandomQueryParams('/clients'))
        .set('Authorization', token);
      expect(response.body.length).toEqual(1);
    });
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('clients').deleteMany({});
    await app.close();
  });
});
