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
exports.UcdisabledHistorySchema = exports.UcdisabledHistory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const abstract_schema_1 = require("../../common/database/abstract.schema");
let UcdisabledHistory = class UcdisabledHistory extends abstract_schema_1.AbstractDocument {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UcdisabledHistory.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], UcdisabledHistory.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UcdisabledHistory.prototype, "ucCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UcdisabledHistory.prototype, "devId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], UcdisabledHistory.prototype, "dataDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UcdisabledHistory.prototype, "user", void 0);
UcdisabledHistory = __decorate([
    (0, mongoose_1.Schema)()
], UcdisabledHistory);
exports.UcdisabledHistory = UcdisabledHistory;
exports.UcdisabledHistorySchema = mongoose_1.SchemaFactory.createForClass(UcdisabledHistory);
//# sourceMappingURL=ucdisabled-history.entity.js.map