"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const job_controller_1 = require("../job.controller");
const job_service_1 = require("../job.service");
describe('JobController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [job_controller_1.JobController],
            providers: [job_service_1.JobService],
        }).compile();
        controller = module.get(job_controller_1.JobController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=job.controller.spec.js.map