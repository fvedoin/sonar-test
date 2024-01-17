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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttAccessService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mqtt_access_entity_1 = require("./entities/mqtt-access.entity");
let MqttAccessService = class MqttAccessService {
    constructor(mqttAccessModel) {
        this.mqttAccessModel = mqttAccessModel;
    }
    create(createMqttAccessDto, session) {
        const createdMqttAccess = new this.mqttAccessModel(createMqttAccessDto);
        return createdMqttAccess.save({ session });
    }
    findAll() {
        return this.mqttAccessModel.find();
    }
    findOne(id) {
        return this.mqttAccessModel.findById(id);
    }
    findOneWhere(where) {
        return this.mqttAccessModel.findOne(where);
    }
    updateOneWhere(where, updateMqttAccessDto, session) {
        return this.mqttAccessModel.findOneAndUpdate(where, updateMqttAccessDto, {
            session,
        });
    }
    update(id, updateMqttAccessDto) {
        return this.mqttAccessModel.findByIdAndUpdate(id, updateMqttAccessDto);
    }
    clearStatus() {
        return this.mqttAccessModel.updateMany({}, { $unset: { online: 1 } });
    }
    connect(devId) {
        return this.mqttAccessModel.updateMany({ devId: devId }, { online: true });
    }
    disconnect(devId) {
        return this.mqttAccessModel.updateMany({ devId: devId }, { online: false });
    }
    remove(id) {
        return this.mqttAccessModel.findByIdAndDelete(id);
    }
};
MqttAccessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(mqtt_access_entity_1.MqttAccess.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MqttAccessService);
exports.MqttAccessService = MqttAccessService;
//# sourceMappingURL=mqtt-access.service.js.map