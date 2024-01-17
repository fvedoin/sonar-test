"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const xml_controller_1 = require("../xml.controller");
const xml_service_1 = require("../xml.service");
const generateCSVQuality_stubs_1 = require("../stubs/generateCSVQuality.stubs");
const ucs_service_1 = require("../../ucs/ucs.service");
const uc_stubs_1 = require("../stubs/uc.stubs");
const userDTO_stub_1 = require("../stubs/userDTO.stub");
const mongoose_1 = require("mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const generateCSV_stubs_1 = require("../stubs/generateCSV.stubs");
jest.mock('@nestjs/event-emitter');
describe('XmlService', () => {
    let service;
    let ucsService;
    let eventEmitter;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [xml_controller_1.XmlController],
            providers: [
                xml_service_1.XmlService,
                event_emitter_1.EventEmitter2,
                {
                    provide: ucs_service_1.UcsService,
                    useValue: {
                        findWhere: jest.fn().mockResolvedValue([(0, uc_stubs_1.ucStubs)()]),
                    },
                },
            ],
        }).compile();
        service = module.get(xml_service_1.XmlService);
        ucsService = module.get(ucs_service_1.UcsService);
        eventEmitter = module.get(event_emitter_1.EventEmitter2);
    });
    it('should be defined service', () => {
        expect(service).toBeDefined();
    });
    it('should be defined ucsService', () => {
        expect(ucsService).toBeDefined();
    });
    describe('generateCSVQuality', () => {
        let dto;
        let user;
        const id = new mongoose_1.Types.ObjectId().toString();
        beforeEach(async () => {
            user = { ...(0, userDTO_stub_1.userDTOStub)(), id };
            dto = { ...(0, generateCSVQuality_stubs_1.generateCSVQualityStubs)(), user };
            await service.generateCSVQuality(dto);
        });
        it('should call ucsService with correct params', () => {
            expect(ucsService.findWhere).toHaveBeenCalledWith({
                ucCode: { $in: dto.ucCodes },
                deviceId: { $exists: true },
            }, {
                deviceId: 1,
                _id: 0,
                ucCode: 1,
                timeZone: 1,
            });
        });
        it('should call eventEmitter with correct params', () => {
            expect(eventEmitter.emit).toHaveBeenCalledWith('xml.generateCSVQuality', {
                foundUcs: [(0, uc_stubs_1.ucStubs)()],
                ...dto,
            });
        });
    });
    describe('generateCSV', () => {
        let dto;
        let user;
        const id = new mongoose_1.Types.ObjectId().toString();
        beforeEach(async () => {
            user = { ...(0, userDTO_stub_1.userDTOStub)(), id };
            dto = { ...(0, generateCSV_stubs_1.generateCSVStubs)(), user };
            await service.generateCSVQuality(dto);
        });
        it('should call ucsService with correct params', () => {
            expect(ucsService.findWhere).toHaveBeenCalledWith({
                ucCode: { $in: dto.ucCodes },
                deviceId: { $exists: true },
            }, {
                deviceId: 1,
                _id: 0,
                ucCode: 1,
                timeZone: 1,
            });
        });
        it('should call eventEmitter with correct params', () => {
            expect(eventEmitter.emit).toHaveBeenCalledWith('xml.generateCSVQuality', {
                foundUcs: [(0, uc_stubs_1.ucStubs)()],
                ...dto,
            });
        });
    });
});
//# sourceMappingURL=xml.service.spec.js.map