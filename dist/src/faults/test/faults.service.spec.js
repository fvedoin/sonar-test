"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const faults_service_1 = require("../faults.service");
const influx_buckets_repository_1 = require("../../influx-buckets/influx-buckets.repository");
const influx_connections_repository_1 = require("../../influx-connections/influx-connections.repository");
const influx_service_1 = require("../../influx/influx.service");
const ucs_repository_1 = require("../../ucs/ucs.repository");
describe('FaultsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                faults_service_1.FaultsService,
                { provide: influx_buckets_repository_1.InfluxBucketRepository, useValue: {} },
                { provide: influx_connections_repository_1.InfluxConnectionRepository, useValue: {} },
                { provide: influx_service_1.InfluxService, useValue: {} },
                { provide: ucs_repository_1.UcsRepository, useValue: {} },
            ],
        }).compile();
        service = module.get(faults_service_1.FaultsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=faults.service.spec.js.map