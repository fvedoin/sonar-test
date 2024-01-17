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
exports.TransformerSchema = exports.Transformer = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const client_entity_1 = require("../../clients/entities/client.entity");
const PointSchema_1 = require("../utils/PointSchema");
const abstract_schema_1 = require("../../common/database/abstract.schema");
const devices_tr_entity_1 = require("../../devices-tr/entities/devices-tr.entity");
let Transformer = class Transformer extends abstract_schema_1.AbstractDocument {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Transformer.prototype, "it", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Transformer.prototype, "serieNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, enum: [1, 2, 3, 4, 5], required: true }),
    __metadata("design:type", Number)
], Transformer.prototype, "tapLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Transformer.prototype, "tap", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Transformer.prototype, "feeder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Transformer.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Transformer.prototype, "loadLimit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Transformer.prototype, "overloadTimeLimit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Transformer.prototype, "nominalValue_i", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: client_entity_1.Client.name,
    }),
    __metadata("design:type", Object)
], Transformer.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PointSchema_1.PointSchema, index: '2dsphere', required: false }),
    __metadata("design:type", Object)
], Transformer.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: false,
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: devices_tr_entity_1.DeviceTr.name,
    }),
    __metadata("design:type", Object)
], Transformer.prototype, "smartTrafoDeviceId", void 0);
Transformer = __decorate([
    (0, mongoose_1.Schema)()
], Transformer);
exports.Transformer = Transformer;
exports.TransformerSchema = mongoose_1.SchemaFactory.createForClass(Transformer);
//# sourceMappingURL=transformer.entity.js.map