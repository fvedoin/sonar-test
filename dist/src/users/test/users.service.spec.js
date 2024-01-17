"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_service_1 = require("../users.service");
const users_repository_1 = require("../users.repository");
const rabbit_mq_service_1 = require("../../rabbit-mq/rabbit-mq.service");
const aws_s3_manager_service_1 = require("../../aws-s3-manager/aws-s3-manager.service");
const userDTO_stub_1 = require("../stubs/userDTO.stub");
const user_stub_1 = require("../stubs/user.stub");
describe('UsersService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [],
            providers: [
                users_service_1.UsersService,
                {
                    provide: users_repository_1.UsersRepository,
                    useValue: {
                        create: jest.fn().mockResolvedValue((0, user_stub_1.userStub)()),
                        findByIdAndUpdate: jest.fn().mockResolvedValue((0, user_stub_1.userStub)()),
                        findById: jest.fn().mockResolvedValue((0, user_stub_1.userStub)()),
                    },
                },
                {
                    provide: rabbit_mq_service_1.RabbitMQService,
                    useValue: {
                        send: jest.fn(),
                    },
                },
                {
                    provide: aws_s3_manager_service_1.AwsS3ManagerService,
                    useValue: {},
                },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        jest.clearAllMocks();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('generateCode', () => {
        let userCreated;
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, userDTO_stub_1.userDTOStub)();
            userCreated = await service.create(dto);
            result = await service.generateCode(userCreated._id);
        });
        it('should be able to return user', () => {
            expect(result).toEqual({
                ...userCreated,
                createdAt: expect.any(Date),
                _id: expect.any(String),
                clientId: expect.any(String),
            });
        });
        it('shouldnt be able to return generate Code', () => {
            expect(result.generateCode).toEqual(undefined);
        });
    });
    describe('verifyCode', () => {
        let userCreated;
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, userDTO_stub_1.userDTOStub)();
            userCreated = await service.create(dto);
            result = await service.verifyCode((0, user_stub_1.userStub)().generatedCode, userCreated._id);
        });
        it('should be able to return code', () => {
            expect(result).toEqual({ code: (0, user_stub_1.userStub)().generatedCode });
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map