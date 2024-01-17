import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { UsersService } from 'src/users/users.service';
import { userDTOStub } from 'src/changelog/stubs/userDTO.stub';
import { createChangeLogWithId } from 'src/changelog/stubs/changelog.stub';
import { createChangelogDto } from 'src/changelog/stubs/changelogDTO.stub';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { updateChangelogDto } from 'src/changelog/stubs/updateChangelogDTO.stub';

describe('Changelog', () => {
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
    await dbConnection.collection('changelogs').deleteMany({});
  });

  it(`should be able to return all changelogs`, async () => {
    const mockChangelogStub = createChangeLogWithId(createChangelogDto());
    await dbConnection.collection('changelogs').insertOne(mockChangelogStub);

    const response = await request(httpServer)
      .get('/changelogs')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject([mockChangelogStub]);
  });

  it(`should be able to return a changelog by id`, async () => {
    const mockChangelogStub = createChangeLogWithId(createChangelogDto());
    await dbConnection.collection('changelogs').insertOne(mockChangelogStub);

    const response = await request(httpServer)
      .get(`/changelogs/${mockChangelogStub._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(mockChangelogStub);
  });

  it('should be able to create a changelog', async () => {
    const mockChangelogStub = createChangeLogWithId(createChangelogDto());

    const response = await request(httpServer)
      .post(`/changelogs`)
      .send(mockChangelogStub)
      .set('Authorization', token);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(mockChangelogStub);
  });

  it('should be able to update a changelog', async () => {
    const mockChangelogStub = createChangeLogWithId(createChangelogDto());
    const mockSettingStubUpdate = updateChangelogDto({
      description: 'Updatedchangelog',
    });

    await dbConnection.collection('changelogs').insertOne(mockChangelogStub);

    const response = await request(httpServer)
      .put(`/changelogs/${mockChangelogStub._id}`)
      .send(mockSettingStubUpdate)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.description).toEqual(
      mockSettingStubUpdate.description,
    );
  });

  it('should be able to delete a changelog', async () => {
    const mockChangelogStub = createChangeLogWithId(createChangelogDto());

    await dbConnection.collection('changelogs').insertOne(mockChangelogStub);

    const response = await request(httpServer)
      .delete(`/changelogs/${mockChangelogStub._id}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await dbConnection
      .collection('users')
      .deleteOne({ username: userDTOStub().username });
    await app.close();
  });
});
