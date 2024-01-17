"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const userDTO_stub_1 = require("../../stubs/userDTO.stub");
const file_stub_1 = require("../../stubs/file.stub");
const createNewsDTO_stub_1 = require("../../stubs/createNewsDTO.stub");
const aws_s3_manager_service_1 = require("../../../aws-s3-manager/aws-s3-manager.service");
describe('News', () => {
    let app;
    let dbConnection;
    let httpServer;
    let userService;
    let responseAuthenticate;
    let token;
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
            .attach('image', (0, file_stub_1.file)().buffer, imageName)
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
        const newsDto = (0, createNewsDTO_stub_1.createNewsDto)({ image: imageName });
        const newsCreated = await dbConnection
            .collection('news')
            .insertOne(newsDto);
        const id = newsCreated.insertedId.toString();
        const sendSpy = jest.spyOn(aws_s3_manager_service_1.AwsS3ManagerService.prototype, 'uploadFile');
        const response = await request(httpServer)
            .put(`/news/${id}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('image', (0, file_stub_1.file)().buffer, imageName)
            .field('title', newsDto.title)
            .field('url', newsDto.url)
            .field('description', newsDto.description)
            .field('oldImage', newsDto.image)
            .set('Authorization', token);
        expect(response.status).toBe(200);
        expect(sendSpy).toHaveBeenCalledWith({
            Bucket: process.env.AWS_BUCKET_FILES,
            Key: imageName,
            Body: (0, file_stub_1.file)().buffer,
        });
        expect(response.body).toMatchObject({
            _id: expect.any(String),
            ...newsDto,
        });
        sendSpy.mockRestore();
    });
    it(`should be able to update a news without new image`, async () => {
        const imageName = `news/${new Date().getTime()}-updated.jpg`;
        const newsDto = (0, createNewsDTO_stub_1.createNewsDto)({ image: imageName });
        const newsCreated = await dbConnection
            .collection('news')
            .insertOne(newsDto);
        const id = newsCreated.insertedId.toString();
        const sendSpy = jest.spyOn(aws_s3_manager_service_1.AwsS3ManagerService.prototype, 'uploadFile');
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
        const newsDto = (0, createNewsDTO_stub_1.createNewsDto)({ image: imageName });
        const newsCreated = await dbConnection
            .collection('news')
            .insertOne(newsDto);
        const id = newsCreated.insertedId.toString();
        const sendSpy = jest.spyOn(aws_s3_manager_service_1.AwsS3ManagerService.prototype, 'deleteFile');
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
            .deleteOne({ username: (0, userDTO_stub_1.userDTOStub)().username });
        await app.close();
    });
});
//# sourceMappingURL=news.e2e-spec.js.map