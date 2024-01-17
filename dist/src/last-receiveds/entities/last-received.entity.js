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
exports.LastReceivedSchema = exports.LastReceived = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const abstract_schema_1 = require("../../common/database/abstract.schema");
const devices_gb_entity_1 = require("../../devices-gb/entities/devices-gb.entity");
class LastReceived extends abstract_schema_1.AbstractDocument {
}
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: devices_gb_entity_1.DeviceGb.name,
    }),
    __metadata("design:type", Object)
], LastReceived.prototype, "deviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], LastReceived.prototype, "port", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], LastReceived.prototype, "snr", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], LastReceived.prototype, "rssi", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Object }),
    __metadata("design:type", Object)
], LastReceived.prototype, "package", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], LastReceived.prototype, "receivedAt", void 0);
exports.LastReceived = LastReceived;
exports.LastReceivedSchema = mongoose_1.SchemaFactory.createForClass(LastReceived);
exports.LastReceivedSchema.index({ deviceId: 1, port: 1 }, { unique: true });
//# sourceMappingURL=last-received.entity.js.map