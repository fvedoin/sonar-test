"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("../auth.service");
const auth_controller_1 = require("../auth.controller");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../../users/users.service");
const token_service_1 = require("../../token/token.service");
const rabbit_mq_service_1 = require("../../rabbit-mq/rabbit-mq.service");
describe('AuthService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                auth_service_1.AuthService,
                jwt_1.JwtService,
                {
                    provide: users_service_1.UsersService,
                    useValue: {},
                },
                {
                    provide: token_service_1.TokenService,
                    useValue: {},
                },
                {
                    provide: rabbit_mq_service_1.RabbitMQService,
                    useValue: {},
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        jest.clearAllMocks();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=auth.service.spec.js.map