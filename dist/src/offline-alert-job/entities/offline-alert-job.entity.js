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
exports.OfflineAlertJobSchema = exports.OfflineAlertJob = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const alert_entity_1 = require("../../alert/entities/alert.entity");
const abstract_schema_1 = require("../../common/database/abstract.schema");
const devices_gb_entity_1 = require("../../devices-gb/entities/devices-gb.entity");
let OfflineAlertJob = class OfflineAlertJob extends abstract_schema_1.AbstractDocument {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], OfflineAlertJob.prototype, "triggerAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: alert_entity_1.Alert.name,
        required: true,
    }),
    __metadata("design:type", Object)
], OfflineAlertJob.prototype, "alertId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: devices_gb_entity_1.DeviceGb.name,
        required: true,
        unique: true,
    }),
    __metadata("design:type", Object)
], OfflineAlertJob.prototype, "deviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true, default: Date.now }),
    __metadata("design:type", Date)
], OfflineAlertJob.prototype, "createdAt", void 0);
OfflineAlertJob = __decorate([
    (0, mongoose_1.Schema)({ collection: 'offlinealertjobs' })
], OfflineAlertJob);
exports.OfflineAlertJob = OfflineAlertJob;
exports.OfflineAlertJobSchema = mongoose_1.SchemaFactory.createForClass(OfflineAlertJob);
//# sourceMappingURL=offline-alert-job.entity.js.map