"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const transformers_controller_1 = require("../transformers.controller");
const transformers_service_1 = require("../transformers.service");
const clients_service_1 = require("../../clients/clients.service");
const transformerAggregateStub_1 = require("../stubs/transformerAggregateStub");
const userDTO_stub_1 = require("../stubs/userDTO.stub");
const users_service_1 = require("../../users/users.service");
jest.mock('../transformers.service');
jest.mock('src/clients/clients.service');
describe('TransformersController', () => {
    let controller;
    let service;
    let clientsService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [transformers_controller_1.TransformersController],
            providers: [
                transformers_service_1.TransformersService,
                clients_service_1.ClientsService,
                {
                    provide: users_service_1.UsersService,
                    useValue: {},
                },
            ],
        }).compile();
        controller = module.get(transformers_controller_1.TransformersController);
        service = module.get(transformers_service_1.TransformersService);
        clientsService = module.get(clients_service_1.ClientsService);
        jest.clearAllMocks();
    });
    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    it('should be defined clientsService', () => {
        expect(clientsService).toBeDefined();
    });
    describe('filterTransformersDevice', () => {
        let result;
        const clientId = (0, userDTO_stub_1.userDTOStub)().clientId.toString();
        beforeEach(async () => {
            result = await controller.filterTransformersDevice(clientId);
        });
        it('should return transformers array', () => {
            expect(result).toEqual({
                data: [(0, transformerAggregateStub_1.transformersAggregateStub)()],
                pageInfo: {
                    count: 1,
                },
            });
        });
        it('should call transformer service', () => {
            expect(service.filterTransformersDevice).toBeCalled();
        });
    });
});
//# sourceMappingURL=transformers.controller.spec.js.map