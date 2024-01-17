"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const users_service_1 = require("../../users.service");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
const file_stub_1 = require("../../stubs/file.stub");
const rabbit_mq_service_1 = require("../../../rabbit-mq/rabbit-mq.service");
const aws_s3_manager_service_1 = require("../../../aws-s3-manager/aws-s3-manager.service");
describe('Users', () => {
    let app;
    let dbConnection;
    let httpServer;
    let userService;
    let responseAuthenticate;
    let token;
    let createdUserId;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        dbConnection = moduleRef
            .get(database_service_1.DatabaseService)
            .getDbHandle();
        userService = moduleRef.get(users_service_1.UsersService);
        httpServer = app.getHttpServer();
        const createUserDto = (0, userDTO_stub_1.userDTOStub)();
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
        const userDTO = (0, userDTO_stub_1.userDTOStub)();
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
        const buffer = (0, file_stub_1.getFileStub)();
        const imageName = 'test.jpg';
        const sendSpy = jest.spyOn(aws_s3_manager_service_1.AwsS3ManagerService.prototype, 'uploadFile');
        const userMock = (0, userDTO_stub_1.userDTOStub)();
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
        expect(response.body.username).toEqual((0, userDTO_stub_1.userDTOStub)().username);
    });
    it(`should be able to generate change code & send to rabbitmq`, async () => {
        const sendSpy = jest.spyOn(rabbit_mq_service_1.RabbitMQService.prototype, 'send');
        const response = await request(httpServer)
            .put(`/users/${createdUserId}/generate-code`)
            .set('Authorization', token);
        expect(sendSpy).toHaveBeenCalledWith('notification', {
            channels: {
                email: {
                    type: 'createCode',
                    receivers: [(0, userDTO_stub_1.userDTOStub)().username],
                    context: {
                        message: expect.any(String),
                    },
                },
            },
        });
        expect(response.status).toBe(200);
        expect(response.body.username).toEqual((0, userDTO_stub_1.userDTOStub)().username);
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
        await dbConnection.collection('users').updateOne({ username: (0, userDTO_stub_1.userDTOStub)().username }, {
            $set: { generatedCode: 123456, codeExpiredAt: now.getTime() + 1000 },
        });
        const response = await request(httpServer)
            .put(`/users/${createdUserId}/verify-code`)
            .send({ code: 123456 })
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(response.body.code).toEqual(123456);
    });
    it(`should be able get error 400 in verify code`, async () => {
        const now = new Date();
        await dbConnection.collection('users').updateOne({ username: (0, userDTO_stub_1.userDTOStub)().username }, {
            $set: { generatedCode: 10101010, codeExpiredAt: now.getTime() + 1000 },
        });
        const response = await request(httpServer)
            .put(`/users/${createdUserId}/verify-code`)
            .set('Authorization', token);
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual('Código inválido.');
    });
    it(`should be able get error in verify code`, async () => {
        const now = new Date();
        await dbConnection.collection('users').updateOne({ username: (0, userDTO_stub_1.userDTOStub)().username }, {
            $set: { generatedCode: 10101010, codeExpiredAt: now.getTime() + 1000 },
        });
        const response = await request(httpServer)
            .put(`/users/${createdUserId}/verify-code`)
            .send({ code: 123456 })
            .set('Authorization', token);
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual('Código inválido.');
    });
    it(`should be able get error 401 in verify code without token`, async () => {
        const now = new Date();
        await dbConnection.collection('users').updateOne({ username: (0, userDTO_stub_1.userDTOStub)().username }, {
            $set: { generatedCode: 10101010, codeExpiredAt: now.getTime() + 1000 },
        });
        const response = await request(httpServer)
            .put(`/users/${createdUserId}/verify-code`)
            .send({ code: 123456 });
        expect(response.status).toBe(401);
    });
    it(`should be able to update profile`, async () => {
        const response = await request(httpServer)
            .put(`/users/${createdUserId}/profile`)
            .field('username', (0, userDTO_stub_1.userDTOStub)().username)
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    it(`should be able to return user data`, async () => {
        const userDTO = {
            ...(0, userDTO_stub_1.userDTOStub)(),
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
        const response = await request(httpServer).put(`/users/${createdUserId}/profile`);
        expect(response.status).toBe(401);
    });
    it(`should accept file & username`, async () => {
        const buffer = (0, file_stub_1.getFileStub)();
        const response = await request(httpServer)
            .put(`/users/${createdUserId}/profile`)
            .set('Content-Type', 'multipart/form-data')
            .attach('image', buffer, 'test.jpg')
            .field('username', (0, userDTO_stub_1.userDTOStub)().username)
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    it(`should not accept without username`, async () => {
        const buffer = (0, file_stub_1.getFileStub)();
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
        const buffer = (0, file_stub_1.getFileStub)();
        const response = await request(httpServer)
            .put(`/users/${createdUserId}/profile`)
            .set('Content-Type', 'multipart/form-data')
            .attach('image', buffer, 'test.jpg')
            .field('name', 'Name')
            .field('phone', '1234567890')
            .field('username', (0, userDTO_stub_1.userDTOStub)().username)
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });
    afterAll(async () => {
        await dbConnection.collection('users').deleteMany({});
        await app.close();
    });
});
//# sourceMappingURL=users.e2e-spec.js.map