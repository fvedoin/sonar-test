"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const influx_service_1 = require("../influx.service");
const influx_repository_1 = require("../influx.repository");
const lastHourDto_stub_1 = require("../stubs/lastHourDto.stub");
const lastHours_stub_1 = require("../stubs/lastHours.stub");
const findQualityDto_stub_1 = require("../stubs/findQualityDto.stub");
const findFaultsDto_stub_1 = require("../stubs/findFaultsDto.stub");
jest.mock('../influx.repository');
describe('InfluxService', () => {
    let service;
    let repository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [influx_service_1.InfluxService, influx_repository_1.InfluxRepository],
        }).compile();
        service = module.get(influx_service_1.InfluxService);
        repository = module.get(influx_repository_1.InfluxRepository);
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    it('should be defined repository', () => {
        expect(repository).toBeDefined();
    });
    describe('lastHour', () => {
        let result;
        let dto;
        beforeEach(async () => {
            dto = (0, lastHourDto_stub_1.lastHourDtoStubs)();
            result = await service.lastHour(dto);
        });
        it('should return a lastHour', () => {
            expect(result).toMatchObject([(0, lastHours_stub_1.lastHourStubs)()]);
        });
        it('should call influx repository', () => {
            expect(repository.connection).toBeCalledWith(dto.host, dto.apiToken);
        });
    });
    describe('findQuality', () => {
        const url = process.env.INFLUX_HOST;
        const token = process.env.INFLUX_API_TOKEN;
        beforeEach(async () => {
            await service.findQuality((0, findQualityDto_stub_1.findQualityDtoStubs)());
        });
        it('should call influx repository', () => {
            expect(repository.connection).toBeCalledWith(url, token);
        });
    });
    describe('findFaultsFieldsByUcAndPeriod', () => {
        let result;
        const faultsDtoStub = (0, findFaultsDto_stub_1.findFaultsDtoStubs)();
        beforeEach(async () => {
            result = await service.findFaultsFieldsByUcAndPeriod(faultsDtoStub);
        });
        it('should call influx repository', () => {
            expect(repository.connection).toBeCalledWith(faultsDtoStub.host, faultsDtoStub.apiToken);
        });
    });
    describe('findFields', () => {
        const url = process.env.INFLUX_HOST;
        const token = process.env.INFLUX_API_TOKEN;
        beforeEach(async () => {
            await service.findQuality((0, findQualityDto_stub_1.findQualityDtoStubs)());
        });
        it('should call influx repository', () => {
            expect(repository.connection).toBeCalledWith(url, token);
        });
    });
});
//# sourceMappingURL=influx.service.spec.js.map