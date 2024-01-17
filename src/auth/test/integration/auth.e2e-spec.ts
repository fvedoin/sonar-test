import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userStub } from 'src/auth/stubs/user.stub';
import { TokenService } from 'src/token/token.service';

describe('Auth', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let userService: UsersService;
  let tokenService: TokenService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    userService = moduleRef.get<UsersService>(UsersService);
    tokenService = moduleRef.get<TokenService>(TokenService);
    httpServer = app.getHttpServer();

    const createUserDto: CreateUserDto = userStub();
    await userService.create(createUserDto);
  });

  it(`should be able to request forgot-password`, async () => {
    const createUserDto: CreateUserDto = userStub();

    const response = await request(httpServer)
      .post('/forgot-password')
      .send({ username: createUserDto.username });

    expect(response.status).toBe(201);
  });

  it(`should be able to request forgot-password and get response empty`, async () => {
    const createUserDto: CreateUserDto = userStub();

    const response = await request(httpServer)
      .post('/forgot-password')
      .send({ username: createUserDto.username });

    expect(response.body).toEqual({});
  });

  it(`should be able to get error in forgot-password without username in body`, async () => {
    const response = await request(httpServer).post('/forgot-password');

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      'Email address provided is incorrect.',
    );
  });

  it(`should be able to get error in forgot-password`, async () => {
    const response = await request(httpServer)
      .post('/forgot-password')
      .send({ username: 'test' });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Document not found.');
  });

  it(`should be able to password-reset`, async () => {
    const password = '123456';

    const createUserDto: CreateUserDto = userStub();

    const createdUser = await userService.findCompleteByUsername(
      createUserDto.username,
    );

    const token = await tokenService.create(createdUser._id.toString());

    const response = await request(httpServer).post('/password-reset').send({
      userId: createdUser._id,
      password,
      token: token,
    });

    expect(response.status).toBe(201);
  });

  it(`should be able to get error in password-reset`, async () => {
    const password = '123456';

    const createUserDto: CreateUserDto = userStub();

    const createdUser = await userService.findCompleteByUsername(
      createUserDto.username,
    );

    const response = await request(httpServer).post('/password-reset').send({
      userId: createdUser._id,
      password,
      token: '123456789',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      'Invalid or expired password reset token.',
    );
  });

  afterAll(async () => {
    await dbConnection.collection('tokens').deleteMany({});
    await dbConnection.collection('users').deleteMany({});
    await app.close();
  });
});
