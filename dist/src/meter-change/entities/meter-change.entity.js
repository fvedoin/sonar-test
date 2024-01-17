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
exports.MeterChangeSchema = exports.MeterChanges = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const client_entity_1 = require("../../clients/entities/client.entity");
const abstract_schema_1 = require("../../common/database/abstract.schema");
const devices_gb_entity_1 = require("../../devices-gb/entities/devices-gb.entity");
let MeterChanges = class MeterChanges extends abstract_schema_1.AbstractDocument {
};
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: client_entity_1.Client.name,
        required: true,
    }),
    __metadata("design:type", Object)
], MeterChanges.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: devices_gb_entity_1.DeviceGb.name,
        required: true,
        unique: false,
        sparse: false,
    }),
    __metadata("design:type", Object)
], MeterChanges.prototype, "deviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MeterChanges.prototype, "ucCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MeterChanges.prototype, "firstConsumedNewMeter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MeterChanges.prototype, "lastConsumedOldMeter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], MeterChanges.prototype, "changedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MeterChanges.prototype, "firstGeneratedNewMeter", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MeterChanges.prototype, "lastGeneratedOldMeter", void 0);
MeterChanges = __decorate([
    (0, mongoose_1.Schema)()
], MeterChanges);
exports.MeterChanges = MeterChanges;
exports.MeterChangeSchema = mongoose_1.SchemaFactory.createForClass(MeterChanges);
//# sourceMappingURL=meter-change.entity.js.map