"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const transformers_service_1 = require("../transformers.service");
const transformers_controller_1 = require("../transformers.controller");
const transformers_repository_1 = require("../transformers.repository");
const clients_service_1 = require("../../clients/clients.service");
const transformerAggregateStub_1 = require("../stubs/transformerAggregateStub");
const userDTO_stub_1 = require("../stubs/userDTO.stub");
const users_service_1 = require("../../users/users.service");
jest.mock('../transformers.repository');
jest.mock('src/clients/clients.service');
describe('TransformersService', () => {
    let repository;
    let service;
    let clientsService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [transformers_controller_1.TransformersController],
            providers: [
                transformers_service_1.TransformersService,
                transformers_repository_1.TransformersRepository,
                clients_service_1.ClientsService,
                {
                    provide: users_service_1.UsersService,
                    useValue: {},
                },
            ],
        }).compile();
        service = module.get(transformers_service_1.TransformersService);
        repository = module.get(transformers_repository_1.TransformersRepository);
        clientsService = module.get(clients_service_1.ClientsService);
        jest.clearAllMocks();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    it('should be defined clientsService', () => {
        expect(clientsService).toBeDefined();
    });
    describe('filterTransformersDevice', () => {
        let result;
        const clientId = (0, userDTO_stub_1.userDTOStub)().clientId.toString();
        beforeEach(async () => {
            result = await service.filterTransformersDevice(clientId);
        });
        it('should return transformers array', () => {
            expect(result).toEqual({
                data: [(0, transformerAggregateStub_1.transformersAggregateStub)()],
                pageInfo: { count: 1 },
            });
        });
        it('Should call Transformers repository', () => {
            expect(repository.aggregate).toBeCalled();
        });
    });
});
//# sourceMappingURL=transformers.service.spec.js.map