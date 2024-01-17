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
exports.DeviceTrSchema = exports.DeviceTr = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const abstract_schema_1 = require("../../common/database/abstract.schema");
let DeviceTr = class DeviceTr extends abstract_schema_1.AbstractDocument {
};
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'Client',
    }),
    __metadata("design:type", Object)
], DeviceTr.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applications',
    }),
    __metadata("design:type", Object)
], DeviceTr.prototype, "applicationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MqttAccesses',
    }),
    __metadata("design:type", Object)
], DeviceTr.prototype, "mqttApplicationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buckets',
    }),
    __metadata("design:type", Object)
], DeviceTr.prototype, "bucketId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['Telik Trafo', 'Telik Trafo Lite', 'Smart Trafo'],
    }),
    __metadata("design:type", String)
], DeviceTr.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], DeviceTr.prototype, "devId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DeviceTr.prototype, "name", void 0);
DeviceTr = __decorate([
    (0, mongoose_1.Schema)({ collection: 'smarttrafodevices' })
], DeviceTr);
exports.DeviceTr = DeviceTr;
exports.DeviceTrSchema = mongoose_1.SchemaFactory.createForClass(DeviceTr);
//# sourceMappingURL=devices-tr.entity.js.map