"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const alert_controller_1 = require("../alert.controller");
const alert_service_1 = require("../alert.service");
describe('AlertController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [alert_controller_1.AlertController],
            providers: [alert_service_1.AlertService],
        }).compile();
        controller = module.get(alert_controller_1.AlertController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=alert.controller.spec.js.map