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
exports.MqttAccessSchema = exports.MqttAccess = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let MqttAccess = class MqttAccess {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MqttAccess.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], MqttAccess.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, unique: true, sparse: true }),
    __metadata("design:type", String)
], MqttAccess.prototype, "devId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], MqttAccess.prototype, "isSuperUser", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MqttAccess.prototype, "encryptedPassword", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'allow' }),
    __metadata("design:type", String)
], MqttAccess.prototype, "permission", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'all' }),
    __metadata("design:type", String)
], MqttAccess.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], MqttAccess.prototype, "topics", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], MqttAccess.prototype, "online", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['client', 'application'] }),
    __metadata("design:type", String)
], MqttAccess.prototype, "type", void 0);
MqttAccess = __decorate([
    (0, mongoose_1.Schema)()
], MqttAccess);
exports.MqttAccess = MqttAccess;
exports.MqttAccessSchema = mongoose_1.SchemaFactory.createForClass(MqttAccess);
//# sourceMappingURL=mqtt-access.entity.js.map