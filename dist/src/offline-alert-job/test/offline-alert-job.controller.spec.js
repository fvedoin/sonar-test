"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const offline_alert_job_controller_1 = require("../offline-alert-job.controller");
const offline_alert_job_service_1 = require("../offline-alert-job.service");
describe('OfflineAlertJobController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [offline_alert_job_controller_1.OfflineAlertJobController],
            providers: [offline_alert_job_service_1.OfflineAlertJobService],
        }).compile();
        controller = module.get(offline_alert_job_controller_1.OfflineAlertJobController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=offline-alert-job.controller.spec.js.map