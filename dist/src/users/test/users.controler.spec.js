"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_controller_1 = require("../users.controller");
const users_service_1 = require("../users.service");
const clients_service_1 = require("../../clients/clients.service");
describe('UsersController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [users_controller_1.UsersController],
            providers: [
                { provide: users_service_1.UsersService, useValue: {} },
                { provide: clients_service_1.ClientsService, useValue: {} },
            ],
        }).compile();
        controller = module.get(users_controller_1.UsersController);
        service = module.get(users_service_1.UsersService);
        jest.clearAllMocks();
    });
    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=users.controler.spec.js.map