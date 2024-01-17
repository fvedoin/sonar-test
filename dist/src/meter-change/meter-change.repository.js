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
exports.MeterChangeRepository = void 0;
const abstract_repository_1 = require("../common/database/abstract.repository");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const common_1 = require("@nestjs/common");
const meter_change_entity_1 = require("./entities/meter-change.entity");
let MeterChangeRepository = class MeterChangeRepository extends abstract_repository_1.AbstractRepository {
    constructor(meterChangeModel, connection) {
        super(meterChangeModel, connection);
        this.meterChangeModel = meterChangeModel;
    }
    async findAndPopulate(filterQuery, populate) {
        return await this.meterChangeModel.find(filterQuery).populate(populate);
    }
    async deleteMany(options) {
        await this.meterChangeModel.deleteMany(options);
    }
    async updateDeviceId(oldDeviceId, newDeviceId, session) {
        return this.meterChangeModel.updateMany({ deviceId: oldDeviceId }, { deviceId: newDeviceId }, { session });
    }
};
MeterChangeRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(meter_change_entity_1.MeterChanges.name)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Connection])
], MeterChangeRepository);
exports.MeterChangeRepository = MeterChangeRepository;
//# sourceMappingURL=meter-change.repository.js.map