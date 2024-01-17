"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const offline_alert_job_service_1 = require("../offline-alert-job.service");
describe('OfflineAlertJobService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [offline_alert_job_service_1.OfflineAlertJobService],
        }).compile();
        service = module.get(offline_alert_job_service_1.OfflineAlertJobService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=offline-alert-job.service.spec.js.map