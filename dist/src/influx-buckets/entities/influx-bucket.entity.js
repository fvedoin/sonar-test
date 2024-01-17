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
exports.InfluxBucketSchema = exports.InfluxBucket = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const abstract_schema_1 = require("../../common/database/abstract.schema");
const influx_connection_entity_1 = require("../../influx-connections/entities/influx-connection.entity");
let InfluxBucket = class InfluxBucket extends abstract_schema_1.AbstractDocument {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], InfluxBucket.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], InfluxBucket.prototype, "alias", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], InfluxBucket.prototype, "product", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clients',
        required: false,
    }),
    __metadata("design:type", Object)
], InfluxBucket.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose.Schema.Types.ObjectId,
        ref: influx_connection_entity_1.InfluxConnection.name,
        required: false,
    }),
    __metadata("design:type", Object)
], InfluxBucket.prototype, "influxConnectionId", void 0);
InfluxBucket = __decorate([
    (0, mongoose_1.Schema)({ collection: 'buckets' })
], InfluxBucket);
exports.InfluxBucket = InfluxBucket;
exports.InfluxBucketSchema = mongoose_1.SchemaFactory.createForClass(InfluxBucket);
//# sourceMappingURL=influx-bucket.entity.js.map