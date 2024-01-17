"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const clients_controller_1 = require("../clients.controller");
const clients_service_1 = require("../clients.service");
const clientDTO_stub_1 = require("../stubs/clientDTO.stub");
const user_stub_1 = require("../stubs/user.stub");
jest.mock('../clients.service');
const user = (0, user_stub_1.userStub)();
describe('ClientsController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [clients_controller_1.ClientsController],
            providers: [clients_service_1.ClientsService],
        }).compile();
        controller = module.get(clients_controller_1.ClientsController);
        service = module.get(clients_service_1.ClientsService);
        jest.clearAllMocks();
    });
    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, clientDTO_stub_1.clientDtoStubs)();
            result = await controller.create(dto, user);
            await controller.create({ parentId: result._id, ...dto }, user);
        });
        it('should return a client', async () => {
            expect(result).toMatchObject(dto);
        });
        it('should return a client with id', () => {
            expect(result._id).toBeDefined();
        });
        it('should call client service', () => {
            expect(service.create).toBeCalledWith(dto, user);
        });
    });
});
//# sourceMappingURL=clients.controller.spec.js.map