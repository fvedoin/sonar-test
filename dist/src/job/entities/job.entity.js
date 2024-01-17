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
exports.JobSchema = exports.Job = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const abstract_schema_1 = require("../../common/database/abstract.schema");
class Job extends abstract_schema_1.AbstractDocument {
}
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: false }),
    __metadata("design:type", Number)
], Job.prototype, "interval", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Job.prototype, "cmd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Job.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Devices', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Job.prototype, "deviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true, default: Date.now }),
    __metadata("design:type", Date)
], Job.prototype, "createdAt", void 0);
exports.Job = Job;
const JobSchema = mongoose_1.SchemaFactory.createForClass(Job);
exports.JobSchema = JobSchema;
JobSchema.index({ deviceId: 1, cmd: 1 }, { unique: true });
//# sourceMappingURL=job.entity.js.map