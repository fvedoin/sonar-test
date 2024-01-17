"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const online_alert_job_service_1 = require("../online-alert-job.service");
describe('OnlineAlertJobService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [online_alert_job_service_1.OnlineAlertJobService],
        }).compile();
        service = module.get(online_alert_job_service_1.OnlineAlertJobService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=online-alert-job.service.spec.js.map