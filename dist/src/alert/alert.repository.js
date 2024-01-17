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
exports.AlertRepository = void 0;
const common_1 = require("@nestjs/common");
const abstract_repository_1 = require("../common/database/abstract.repository");
const alert_entity_1 = require("./entities/alert.entity");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let AlertRepository = class AlertRepository extends abstract_repository_1.AbstractRepository {
    constructor(alertModel, connection) {
        super(alertModel, connection);
        this.alertModel = alertModel;
    }
    async deleteMany(where) {
        await this.alertModel.deleteMany(where);
    }
    async findAllAndPopulate(populate) {
        return await this.alertModel.find().populate(populate);
    }
    async findByDeviceId(deviceId) {
        return await this.alertModel.find({ deviceId: deviceId });
    }
    async updateDeviceId(oldDeviceId, newDeviceId, session) {
        return await this.alertModel.updateMany({ deviceId: oldDeviceId }, { deviceId: newDeviceId }, { session });
    }
};
AlertRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(alert_entity_1.Alert.name)),
    __param(1, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Connection])
], AlertRepository);
exports.AlertRepository = AlertRepository;
//# sourceMappingURL=alert.repository.js.map