"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const alert_service_1 = require("../alert.service");
describe('AlertService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [alert_service_1.AlertService],
        }).compile();
        service = module.get(alert_service_1.AlertService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=alert.service.spec.js.map