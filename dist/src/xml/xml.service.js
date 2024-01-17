"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const ucs_service_1 = require("../ucs/ucs.service");
let XmlService = class XmlService {
    constructor(ucsServices, eventEmitter) {
        this.ucsServices = ucsServices;
        this.eventEmitter = eventEmitter;
    }
    async generateCSVQuality(data) {
        const { ucCodes } = data;
        const foundUcs = await this.ucsServices.findWhere({
            ucCode: { $in: ucCodes },
            deviceId: { $exists: true },
        }, {
            deviceId: 1,
            _id: 0,
            ucCode: 1,
            timeZone: 1,
        });
        if (!foundUcs.length) {
            throw new Error('Nenhuma UC encontrada ou nenhum disposito vinculado!');
        }
        const dataEvent = {
            foundUcs,
            ...data,
        };
        this.eventEmitter.emit('xml.generateCSVQuality', dataEvent);
    }
    async generateCSV(data) {
        const { ucCodes } = data;
        const foundUcs = await this.ucsServices.findWhere({
            ucCode: { $in: ucCodes },
            deviceId: { $exists: true },
        }, {
            deviceId: 1,
            _id: 0,
            ucCode: 1,
            timeZone: 1,
        });
        if (!foundUcs.length) {
            throw new Error('Nenhuma UC encontrada ou nenhum disposito vinculado!');
        }
        const dataEvent = {
            foundUcs,
            ...data,
        };
        this.eventEmitter.emit('xml.generateCSV', dataEvent);
    }
};
XmlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ucs_service_1.UcsService,
        event_emitter_1.EventEmitter2])
], XmlService);
exports.XmlService = XmlService;
//# sourceMappingURL=xml.service.js.map