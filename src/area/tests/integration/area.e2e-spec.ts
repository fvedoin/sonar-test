import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, Types } from 'mongoose';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/common/database/database.service';
import { areaStubs } from 'src/area/stubs/area.stub';
import { areaDtoStubs } from 'src/area/stubs/areaDTO.stub';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { userDTOStub } from 'src/area/stubs/userDTO.stub';
import { Role } from 'src/auth/models/Role';
import { AreaRepository } from 'src/area/area.repository';

describe('Area', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let httpServer: any;
  let userService: UsersService;

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

  describe('Access with access level Role.SUPER_ADMIN', () => {
    let response: request.Response;
    let adminToken: string;
    const createUserDto: CreateUserDto = userDTOStub();

    beforeAll(async () => {
      await userService.create(createUserDto);

      response = await request(httpServer).post('/login').send({
        username: createUserDto.username,
        password: createUserDto.password,
      });

      adminToken = `Bearer ${response.body.access_token}`;
    });

    afterEach(async () => {
      await dbConnection.collection('areas').deleteMany({});
    });

    it(`should be able to return all areas`, async () => {
      const mockAreaStub = areaStubs(areaDtoStubs());
      await dbConnection.collection('areas').insertMany([
        mockAreaStub,
        {
          ...mockAreaStub,
          _id: new Types.ObjectId(),
          clientId: createUserDto.clientId,
        },
        {
          ...mockAreaStub,
          _id: new Types.ObjectId(),
          clientId: new Types.ObjectId(),
        },
      ]);

      const response = await request(httpServer)
        .get('/areas')
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
    });

    it(`should be able to return a area by id`, async () => {
      const mockAreaStub = areaStubs(areaDtoStubs());
      await dbConnection.collection('areas').insertOne(mockAreaStub);

      const response = await request(httpServer)
        .get(`/areas/${mockAreaStub._id.toString()}`)
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(mockAreaStub);
    });

    it('should be able to create a area', async () => {
      const mockAreaStub = areaDtoStubs();

      const response = await request(httpServer)
        .post(`/areas`)
        .send(mockAreaStub)
        .set('Authorization', adminToken);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(areaStubs(mockAreaStub));
    });

    it('shouldnt be able to create a area', async () => {
      const mockAreaStub = areaDtoStubs();

      const response = await request(httpServer)
        .post(`/areas`)
        .send({ ...mockAreaStub, clientId: null })
        .set('Authorization', adminToken);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('ClientId é obrigatório');
    });

    it('should be able to update a area', async () => {
      const mockAreaStub = areaStubs(areaDtoStubs());
      const mockAreaStubUpdate = areaDtoStubs({ name: 'Updated area' });

      await dbConnection.collection('areas').insertOne(mockAreaStub);

      const response = await request(httpServer)
        .put(`/areas/${mockAreaStub._id}`)
        .send(mockAreaStubUpdate)
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(mockAreaStubUpdate.name);
    });

    it('should be able to delete a area', async () => {
      const mockAreaStub = areaStubs(areaDtoStubs());

      await dbConnection.collection('areas').insertOne(mockAreaStub);

      const response = await request(httpServer)
        .delete(`/areas/${mockAreaStub._id}`)
        .set('Authorization', adminToken);

      expect(response.status).toBe(200);
    });

    afterAll(async () => {
      await dbConnection
        .collection('users')
        .deleteOne({ username: userDTOStub().username });

      await dbConnection.collection('areas').deleteMany({});
    });
  });

  // describe('Access with access level Role.MANAGER', () => {
  //   let managerToken;
  //   const clientId = new Types.ObjectId();

  //   const managerUser = {
  //     ...userDTOStub(),
  //     username: 'area@manager.com.br',
  //     clientId: clientId.toString(),
  //     accessLevel: Role.MANAGER,
  //   };

  //   afterEach(async () => {
  //     await dbConnection.collection('areas').deleteMany({});
  //   });

  //   beforeAll(async () => {
  //     await userService.create(managerUser);

  //     const response = await request(httpServer).post('/login').send({
  //       username: managerUser.username,
  //       password: managerUser.password,
  //     });

  //     managerToken = `Bearer ${response.body.access_token}`;
  //   });

  //   // it(`should be able to return all (2) areas`, async () => {
  //   //   const mockAreaStub = areaStubs(areaDtoStubs({ clientId }));

  //   //   await dbConnection.collection('areas').insertMany([
  //   //     {
  //   //       ...mockAreaStub,
  //   //       _id: new Types.ObjectId(),
  //   //       clientId: clientId.toString(),
  //   //     },
  //   //     {
  //   //       ...mockAreaStub,
  //   //       _id: new Types.ObjectId(),
  //   //       clientId: new Types.ObjectId(),
  //   //     },
  //   //     {
  //   //       ...mockAreaStub,
  //   //       _id: new Types.ObjectId(),
  //   //       clientId: clientId.toString(),
  //   //     },
  //   //   ]);

  //   //   const response = await request(httpServer)
  //   //     .get('/areas')
  //   //     .set('Authorization', managerToken);

  //   //   expect(response.status).toBe(200);
  //   //   expect(response.body.length).toBe(2);
  //   // });

  //   it(`should be able to return all (2) areas`, async () => {
  //     const response = await request(httpServer)
  //       .get('/areas')
  //       .set('Authorization', managerToken);

  //     expect(response.status).toBe(200);
  //     expect(response.body.length).toBe(2);
  //   });

  //   it('should be able to create a area', async () => {
  //     const mockAreaStub = areaDtoStubs();

  //     const response = await request(httpServer)
  //       .post(`/areas`)
  //       .send(mockAreaStub)
  //       .set('Authorization', managerToken);

  //     expect(response.status).toBe(201);
  //     expect(response.body).toMatchObject(areaStubs(mockAreaStub));
  //   });

  //   afterAll(async () => {
  //     await dbConnection
  //       .collection('users')
  //       .deleteOne({ username: managerUser.username });
  //     await dbConnection.collection('areas').deleteMany({});
  //   });
  // });

  afterAll(async () => {
    await app.close();
  });
});
