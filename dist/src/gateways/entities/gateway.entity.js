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
exports.GatewaySchema = exports.Gateway = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const client_entity_1 = require("../../clients/entities/client.entity");
const PointSchema_1 = require("../utils/PointSchema");
const abstract_schema_1 = require("../../common/database/abstract.schema");
let Gateway = class Gateway extends abstract_schema_1.AbstractDocument {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Gateway.prototype, "ttnId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Gateway.prototype, "online", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], Gateway.prototype, "lastChecked", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose.Schema.Types.ObjectId],
        ref: client_entity_1.Client.name,
        required: false,
    }),
    __metadata("design:type", Array)
], Gateway.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PointSchema_1.PointSchema, index: '2dsphere', required: false }),
    __metadata("design:type", Object)
], Gateway.prototype, "location", void 0);
Gateway = __decorate([
    (0, mongoose_1.Schema)()
], Gateway);
exports.Gateway = Gateway;
exports.GatewaySchema = mongoose_1.SchemaFactory.createForClass(Gateway);
//# sourceMappingURL=gateway.entity.js.map