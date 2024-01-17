"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const faults_controller_1 = require("../faults.controller");
const faults_service_1 = require("../faults.service");
describe('FaultsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [faults_controller_1.FaultsController],
            providers: [{ provide: faults_service_1.FaultsService, useValue: {} }],
        }).compile();
        controller = module.get(faults_controller_1.FaultsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=faults.controller.spec.js.map