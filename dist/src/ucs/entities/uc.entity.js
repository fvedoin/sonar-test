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
exports.UcSchema = exports.Uc = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const client_entity_1 = require("../../clients/entities/client.entity");
const devices_gb_entity_1 = require("../../devices-gb/entities/devices-gb.entity");
const last_received_entity_1 = require("../../last-receiveds/entities/last-received.entity");
const setting_entity_1 = require("../../settings/entities/setting.entity");
const transformer_entity_1 = require("../../transformers/entities/transformer.entity");
const PointSchema_1 = require("../utils/PointSchema");
const abstract_schema_1 = require("../../common/database/abstract.schema");
let Uc = class Uc extends abstract_schema_1.AbstractDocument {
};
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: client_entity_1.Client.name,
        required: true,
    }),
    __metadata("design:type", Object)
], Uc.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: transformer_entity_1.Transformer.name,
        required: true,
    }),
    __metadata("design:type", Object)
], Uc.prototype, "transformerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: devices_gb_entity_1.DeviceGb.name,
        required: false,
        unique: true,
        sparse: true,
    }),
    __metadata("design:type", Object)
], Uc.prototype, "deviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Uc.prototype, "routeCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Uc.prototype, "ucCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Uc.prototype, "ucNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Uc.prototype, "ucClass", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Uc.prototype, "subClass", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Uc.prototype, "billingGroup", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 220 }),
    __metadata("design:type", Number)
], Uc.prototype, "ratedVoltage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Uc.prototype, "group", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Uc.prototype, "subGroup", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Uc.prototype, "sequence", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['A', 'B', 'C', 'AB', 'AC', 'BC', 'ABC'],
        required: true,
    }),
    __metadata("design:type", String)
], Uc.prototype, "phases", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Uc.prototype, "circuitBreaker", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], Uc.prototype, "microgeneration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Uc.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Uc.prototype, "district", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: false }),
    __metadata("design:type", Boolean)
], Uc.prototype, "isCutted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Uc.prototype, "timeZone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PointSchema_1.PointSchema, index: '2dsphere', required: false }),
    __metadata("design:type", Object)
], Uc.prototype, "location", void 0);
Uc = __decorate([
    (0, mongoose_1.Schema)({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
], Uc);
exports.Uc = Uc;
exports.UcSchema = mongoose_1.SchemaFactory.createForClass(Uc);
exports.UcSchema.virtual('lastReceived', {
    ref: last_received_entity_1.LastReceived.name,
    foreignField: 'deviceId',
    localField: 'deviceId',
});
exports.UcSchema.virtual('settings', {
    ref: setting_entity_1.Setting.name,
    foreignField: 'clientId',
    localField: 'clientId',
});
//# sourceMappingURL=uc.entity.js.map