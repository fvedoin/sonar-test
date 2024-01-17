import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userDTOStub } from 'src/news/stubs/userDTO.stub';
import { file } from 'src/news/stubs/file.stub';
import { createNewsDto } from 'src/news/stubs/createNewsDTO.stub';
import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';

describe('News', () => {
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

  afterEach(async () => {
    await dbConnection.collection('news').deleteMany({});
  });

  it(`should be able to return all news`, async () => {
    const response = await request(httpServer)
      .get('/news')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it(`should be able to create a news`, async () => {
    const imageName = 'test.jpg';

    const response = await request(httpServer)
      .post('/news')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', file().buffer, imageName)
      .field('title', 'title')
      .field('url', 'url')
      .field('description', 'description')
      .set('Authorization', token);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      _id: expect.any(String),
      title: 'title',
      url: 'url',
      description: 'description',
      image: expect.stringMatching(/^news\/\d{13}-test\.jpg$/),
      __v: expect.any(Number),
    });
  });

  it(`should be able to update a news`, async () => {
    const imageName = `news/${new Date().getTime()}-updated.jpg`;
    const newsDto = createNewsDto({ image: imageName });

    const newsCreated = await dbConnection
      .collection('news')
      .insertOne(newsDto);
    const id = newsCreated.insertedId.toString();

    const sendSpy = jest.spyOn(AwsS3ManagerService.prototype, 'uploadFile');

    const response = await request(httpServer)
      .put(`/news/${id}`)
      .set('Content-Type', 'multipart/form-data')
      .attach('image', file().buffer, imageName)
      .field('title', newsDto.title)
      .field('url', newsDto.url)
      .field('description', newsDto.description)
      .field('oldImage', newsDto.image)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(sendSpy).toHaveBeenCalledWith({
      Bucket: process.env.AWS_BUCKET_FILES,
      Key: imageName,
      Body: file().buffer,
    });
    expect(response.body).toMatchObject({
      _id: expect.any(String),
      ...newsDto,
    });

    sendSpy.mockRestore();
  });

  it(`should be able to update a news without new image`, async () => {
    const imageName = `news/${new Date().getTime()}-updated.jpg`;
    const newsDto = createNewsDto({ image: imageName });

    const newsCreated = await dbConnection
      .collection('news')
      .insertOne(newsDto);
    const id = newsCreated.insertedId.toString();

    const sendSpy = jest.spyOn(AwsS3ManagerService.prototype, 'uploadFile');

    const response = await request(httpServer)
      .put(`/news/${id}`)
      .set('Content-Type', 'multipart/form-data')
      .field('title', newsDto.title)
      .field('url', newsDto.url)
      .field('description', newsDto.description)
      .field('oldImage', newsDto.image)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(sendSpy).not.toBeCalled();
    expect(response.body).toMatchObject({
      _id: expect.any(String),
      ...newsDto,
    });

    sendSpy.mockRestore();
  });

  it(`should be able to delete a news`, async () => {
    const imageName = `news/${new Date().getTime()}-updated.jpg`;
    const newsDto = createNewsDto({ image: imageName });

    const newsCreated = await dbConnection
      .collection('news')
      .insertOne(newsDto);
    const id = newsCreated.insertedId.toString();

    const sendSpy = jest.spyOn(AwsS3ManagerService.prototype, 'deleteFile');

    const response = await request(httpServer)
      .delete(`/news/${id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(sendSpy).toHaveBeenCalledWith({
      Bucket: process.env.AWS_BUCKET_FILES,
      Key: imageName,
    });
    expect(response.body).toMatchObject({});

    sendSpy.mockRestore();
  });

  afterAll(async () => {
    await dbConnection
      .collection('users')
      .deleteOne({ username: userDTOStub().username });

    await app.close();
  });
});
