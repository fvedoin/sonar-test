import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import * as request from 'supertest';

import { UsersService } from 'src/users/users.service';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { userDTOStub } from 'src/users/stubs/userDTO.stub';
import { getFileStub } from 'src/users/stubs/file.stub';
import { RabbitMQService } from 'src/rabbit-mq/rabbit-mq.service';
import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';

describe('Users', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let userService: UsersService;
  let responseAuthenticate: request.Response;
  let token: string;
  let createdUserId: string;

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

    const createUserDto = userDTOStub();

    await dbConnection.collection('users').deleteMany({});

    createdUserId = (await userService.create(createUserDto))._id;

    responseAuthenticate = await request(httpServer).post('/login').send({
      username: createUserDto.username,
      password: createUserDto.password,
    });

    token = `Bearer ${responseAuthenticate.body.access_token}`;
  });

  it(`should be able to get profile`, async () => {
    const response = await request(httpServer)
      .get(`/users/${createdUserId}/profile`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
  });

  it(`should be able to get my profile`, async () => {
    const userDTO = userDTOStub();

    const response = await request(httpServer)
      .get(`/users/${createdUserId}/profile`)
      .set('Authorization', token);

    expect(response.status).toBe(200);

    delete userDTO.password;

    expect(response.body).toMatchObject({
      ...userDTO,
      _id: expect.any(String),
      clientId: expect.any(String),
      createdAt: expect.any(String),
      active: true,
      blocked: false,
      image: null,
    });
  });

  it(`should be able to get my profile & image from aws s3`, async () => {
    const buffer = getFileStub();
    const imageName = 'test.jpg';
    const sendSpy = jest.spyOn(AwsS3ManagerService.prototype, 'uploadFile');

    const userMock = userDTOStub();

    const insertedUser = await dbConnection
      .collection('users')
      .insertOne({ ...userMock, username: 'teste@updload.image' });

    await request(httpServer)
      .put(`/users/${insertedUser.insertedId}/profile`)
      .set('Content-Type', 'multipart/form-data')
      .attach('image', buffer, imageName)
      .field('username', 'teste@updload.image')
      .set('Authorization', token);

    const imagePath = `${insertedUser.insertedId}/profile-${imageName}`;

    const response = await request(httpServer)
      .get(`/users/${insertedUser.insertedId}/profile`)
      .set('Authorization', token);

    expect(sendSpy).toHaveBeenCalledWith({
      Bucket: process.env.AWS_BUCKET_FILES,
      Key: imagePath,
      Body: buffer,
    });
    expect(response.status).toBe(200);
    expect(typeof response.body.image).toEqual('string');
  });

  it(`should be able to generate change code`, async () => {
    const response = await request(httpServer)
      .put(`/users/${createdUserId}/generate-code`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.username).toEqual(userDTOStub().username);
  });

  it(`should be able to generate change code & send to rabbitmq`, async () => {
    const sendSpy = jest.spyOn(RabbitMQService.prototype, 'send');

    const response = await request(httpServer)
      .put(`/users/${createdUserId}/generate-code`)
      .set('Authorization', token);

    expect(sendSpy).toHaveBeenCalledWith('notification', {
      channels: {
        email: {
          type: 'createCode',
          receivers: [userDTOStub().username],
          context: {
            message: expect.any(String),
          },
        },
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.username).toEqual(userDTOStub().username);

    sendSpy.mockRestore();
  });

  it(`should be able not to return change code`, async () => {
    const response = await request(httpServer)
      .put(`/users/${createdUserId}/generate-code`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.generatedCode).toEqual(undefined);
  });

  it(`should be able to return without password`, async () => {
    const response = await request(httpServer)
      .put(`/users/${createdUserId}/generate-code`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.password).toEqual(undefined);
  });

  it(`should be able to verify code`, async () => {
    const now = new Date();
    await dbConnection.collection('users').updateOne(
      { username: userDTOStub().username },
      {
        $set: { generatedCode: 123456, codeExpiredAt: now.getTime() + 1000 },
      },
    );

    const response = await request(httpServer)
      .put(`/users/${createdUserId}/verify-code`)
      .send({ code: 123456 })
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.code).toEqual(123456);
  });

  it(`should be able get error 400 in verify code`, async () => {
    const now = new Date();
    await dbConnection.collection('users').updateOne(
      { username: userDTOStub().username },
      {
        $set: { generatedCode: 10101010, codeExpiredAt: now.getTime() + 1000 },
      },
    );

    const response = await request(httpServer)
      .put(`/users/${createdUserId}/verify-code`)
      .set('Authorization', token);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Código inválido.');
  });

  it(`should be able get error in verify code`, async () => {
    const now = new Date();
    await dbConnection.collection('users').updateOne(
      { username: userDTOStub().username },
      {
        $set: { generatedCode: 10101010, codeExpiredAt: now.getTime() + 1000 },
      },
    );

    const response = await request(httpServer)
      .put(`/users/${createdUserId}/verify-code`)
      .send({ code: 123456 })
      .set('Authorization', token);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('Código inválido.');
  });

  it(`should be able get error 401 in verify code without token`, async () => {
    const now = new Date();
    await dbConnection.collection('users').updateOne(
      { username: userDTOStub().username },
      {
        $set: { generatedCode: 10101010, codeExpiredAt: now.getTime() + 1000 },
      },
    );

    const response = await request(httpServer)
      .put(`/users/${createdUserId}/verify-code`)
      .send({ code: 123456 });

    expect(response.status).toBe(401);
  });

  it(`should be able to update profile`, async () => {
    const response = await request(httpServer)
      .put(`/users/${createdUserId}/profile`)
      .field('username', userDTOStub().username)
      .set('Authorization', token);

    expect(response.status).toBe(200);
  });

  it(`should be able to return user data`, async () => {
    const userDTO = {
      ...userDTOStub(),
      username: 'teste@updload1.image',
      image: 'teste@upload.com',
    };

    const insertedUser = await dbConnection
      .collection('users')
      .insertOne(userDTO);

    const response = await request(httpServer)
      .put(`/users/${insertedUser.insertedId}/profile`)
      .field('username', userDTO.username)
      .set('Authorization', token);

    delete userDTO.password;

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      ...userDTO,
      _id: expect.any(String),
      clientId: expect.any(String),
      createdAt: expect.any(String),
      active: true,
      blocked: false,
      image: expect.anything(),
    });
  });

  it(`should be able get error 401 in update profile without token`, async () => {
    const response = await request(httpServer).put(
      `/users/${createdUserId}/profile`,
    );

    expect(response.status).toBe(401);
  });

  it(`should accept file & username`, async () => {
    const buffer = getFileStub();

    const response = await request(httpServer)
      .put(`/users/${createdUserId}/profile`)
      .set('Content-Type', 'multipart/form-data')
      .attach('image', buffer, 'test.jpg')
      .field('username', userDTOStub().username)
      .set('Authorization', token);

    expect(response.status).toBe(200);
  });

  it(`should not accept without username`, async () => {
    const buffer = getFileStub();

    const response = await request(httpServer)
      .put(`/users/${createdUserId}/profile`)
      .set('Content-Type', 'multipart/form-data')
      .attach('image', buffer, 'test.jpg')
      .field('name', 'Name')
      .field('phone', '1234567890')
      .set('Authorization', token);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username deve ser informado.');
  });

  it(`should accept file & other fields`, async () => {
    const buffer = getFileStub();

    const response = await request(httpServer)
      .put(`/users/${createdUserId}/profile`)
      .set('Content-Type', 'multipart/form-data')
      .attach('image', buffer, 'test.jpg')
      .field('name', 'Name')
      .field('phone', '1234567890')
      .field('username', userDTOStub().username)
      .set('Authorization', token);

    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await app.close();
  });
});
