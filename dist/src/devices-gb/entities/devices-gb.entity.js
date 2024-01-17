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
exports.DeviceGbSchema = exports.DeviceGb = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const application_entity_1 = require("../../applications/entities/application.entity");
const abstract_schema_1 = require("../../common/database/abstract.schema");
const influx_bucket_entity_1 = require("../../influx-buckets/entities/influx-bucket.entity");
let DeviceGb = class DeviceGb extends abstract_schema_1.AbstractDocument {
};
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: mongoose_2.default.Types.ObjectId,
        ref: 'Client',
    }),
    __metadata("design:type", Object)
], DeviceGb.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: application_entity_1.Application.name,
        required: false,
    }),
    __metadata("design:type", Object)
], DeviceGb.prototype, "applicationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: influx_bucket_entity_1.InfluxBucket.name,
        required: true,
    }),
    __metadata("design:type", Object)
], DeviceGb.prototype, "bucketId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['PIMA', 'ABNT NBR 14522', 'Saída de usuário', 'DLMS'],
    }),
    __metadata("design:type", String)
], DeviceGb.prototype, "communication", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['LoRa', 'GSM'],
    }),
    __metadata("design:type", String)
], DeviceGb.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        unique: true,
    }),
    __metadata("design:type", String)
], DeviceGb.prototype, "devId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DeviceGb.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], DeviceGb.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], DeviceGb.prototype, "allows", void 0);
DeviceGb = __decorate([
    (0, mongoose_1.Schema)({ collection: 'devices' })
], DeviceGb);
exports.DeviceGb = DeviceGb;
exports.DeviceGbSchema = mongoose_1.SchemaFactory.createForClass(DeviceGb);
//# sourceMappingURL=devices-gb.entity.js.map