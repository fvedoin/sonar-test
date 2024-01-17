"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../../app.module");
const database_service_1 = require("../../../common/database/database.service");
const users_service_1 = require("../../../users/users.service");
const user_stub_1 = require("../../stubs/user.stub");
const token_service_1 = require("../../../token/token.service");
describe('Auth', () => {
    let app;
    let dbConnection;
    let httpServer;
    let userService;
    let tokenService;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
            providers: [],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        dbConnection = moduleRef
            .get(database_service_1.DatabaseService)
            .getDbHandle();
        userService = moduleRef.get(users_service_1.UsersService);
        tokenService = moduleRef.get(token_service_1.TokenService);
        httpServer = app.getHttpServer();
        const createUserDto = (0, user_stub_1.userStub)();
        await userService.create(createUserDto);
    });
    it(`should be able to request forgot-password`, async () => {
        const createUserDto = (0, user_stub_1.userStub)();
        const response = await request(httpServer)
            .post('/forgot-password')
            .send({ username: createUserDto.username });
        expect(response.status).toBe(201);
    });
    it(`should be able to request forgot-password and get response empty`, async () => {
        const createUserDto = (0, user_stub_1.userStub)();
        const response = await request(httpServer)
            .post('/forgot-password')
            .send({ username: createUserDto.username });
        expect(response.body).toEqual({});
    });
    it(`should be able to get error in forgot-password without username in body`, async () => {
        const response = await request(httpServer).post('/forgot-password');
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual('Email address provided is incorrect.');
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
        const createUserDto = (0, user_stub_1.userStub)();
        const createdUser = await userService.findCompleteByUsername(createUserDto.username);
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
        const createUserDto = (0, user_stub_1.userStub)();
        const createdUser = await userService.findCompleteByUsername(createUserDto.username);
        const response = await request(httpServer).post('/password-reset').send({
            userId: createdUser._id,
            password,
            token: '123456789',
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual('Invalid or expired password reset token.');
    });
    afterAll(async () => {
        await dbConnection.collection('tokens').deleteMany({});
        await dbConnection.collection('users').deleteMany({});
        await app.close();
    });
});
//# sourceMappingURL=auth.e2e-spec.js.map