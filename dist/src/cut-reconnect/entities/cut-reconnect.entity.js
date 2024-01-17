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
exports.CutReconnectSchema = exports.CutReconnect = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const client_entity_1 = require("../../clients/entities/client.entity");
const devices_gb_entity_1 = require("../../devices-gb/entities/devices-gb.entity");
const abstract_schema_1 = require("../../common/database/abstract.schema");
let CutReconnect = class CutReconnect extends abstract_schema_1.AbstractDocument {
};
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
    }),
    __metadata("design:type", Number)
], CutReconnect.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['LoRa', 'GSM'],
    }),
    __metadata("design:type", String)
], CutReconnect.prototype, "tech", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], CutReconnect.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: client_entity_1.Client.name,
        required: true,
    }),
    __metadata("design:type", String)
], CutReconnect.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: devices_gb_entity_1.DeviceGb.name,
        required: true,
    }),
    __metadata("design:type", Object)
], CutReconnect.prototype, "deviceId", void 0);
CutReconnect = __decorate([
    (0, mongoose_1.Schema)({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
], CutReconnect);
exports.CutReconnect = CutReconnect;
exports.CutReconnectSchema = mongoose_1.SchemaFactory.createForClass(CutReconnect);
//# sourceMappingURL=cut-reconnect.entity.js.map