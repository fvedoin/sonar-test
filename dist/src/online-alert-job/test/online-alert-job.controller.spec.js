"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const online_alert_job_controller_1 = require("../online-alert-job.controller");
const online_alert_job_service_1 = require("../online-alert-job.service");
describe('OnlineAlertJobController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [online_alert_job_controller_1.OnlineAlertJobController],
            providers: [online_alert_job_service_1.OnlineAlertJobService],
        }).compile();
        controller = module.get(online_alert_job_controller_1.OnlineAlertJobController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=online-alert-job.controller.spec.js.map