"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const xml_controller_1 = require("../xml.controller");
const xml_service_1 = require("../xml.service");
const generateCSVQuality_stubs_1 = require("../stubs/generateCSVQuality.stubs");
const generateCSV_stubs_1 = require("../stubs/generateCSV.stubs");
const userDTO_stub_1 = require("../stubs/userDTO.stub");
const mongoose_1 = require("mongoose");
jest.mock('../xml.service');
describe('XmlController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [xml_controller_1.XmlController],
            providers: [xml_service_1.XmlService],
        }).compile();
        controller = module.get(xml_controller_1.XmlController);
        service = module.get(xml_service_1.XmlService);
    });
    it('should be defined controller', () => {
        expect(controller).toBeDefined();
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    describe('export-csv-quality', () => {
        let dto;
        let user;
        const id = new mongoose_1.Types.ObjectId().toString();
        beforeEach(async () => {
            dto = (0, generateCSVQuality_stubs_1.generateCSVQualityStubs)();
            user = { ...(0, userDTO_stub_1.userDTOStub)(), id };
            await controller.generateCSVQuality(dto, user);
        });
        it('should call xmlService', () => {
            expect(service.generateCSVQuality).toBeCalledWith({ ...dto, user });
        });
    });
    describe('export-csv', () => {
        let dto;
        let user;
        const id = new mongoose_1.Types.ObjectId().toString();
        beforeEach(async () => {
            dto = (0, generateCSV_stubs_1.generateCSVStubs)();
            user = { ...(0, userDTO_stub_1.userDTOStub)(), id };
            await controller.generateCSV(dto, user);
        });
        it('should call xmlService', () => {
            expect(service.generateCSV).toBeCalledWith({ ...dto, user });
        });
    });
});
//# sourceMappingURL=xml.controller.spec.js.map