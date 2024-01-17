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
exports.AlertGatewaySchema = exports.AlertGateway = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const abstract_schema_1 = require("../../common/database/abstract.schema");
class AlertGateway extends abstract_schema_1.AbstractDocument {
}
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: mongoose_2.default.Types.ObjectId,
        ref: 'Client',
    }),
    __metadata("design:type", Object)
], AlertGateway.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], AlertGateway.prototype, "emails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], AlertGateway.prototype, "interval", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], AlertGateway.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], AlertGateway.prototype, "ttnId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, required: true, default: true }),
    __metadata("design:type", Boolean)
], AlertGateway.prototype, "enabled", void 0);
exports.AlertGateway = AlertGateway;
exports.AlertGatewaySchema = mongoose_1.SchemaFactory.createForClass(AlertGateway);
//# sourceMappingURL=alert-gateway.entity.js.map