"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluxBucketsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const clients_module_1 = require("../clients/clients.module");
const influx_connections_module_1 = require("../influx-connections/influx-connections.module");
const influx_bucket_entity_1 = require("./entities/influx-bucket.entity");
const influx_buckets_controller_1 = require("./influx-buckets.controller");
const influx_buckets_service_1 = require("./influx-buckets.service");
const influx_buckets_repository_1 = require("./influx-buckets.repository");
let InfluxBucketsModule = class InfluxBucketsModule {
};
InfluxBucketsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: influx_bucket_entity_1.InfluxBucket.name,
                    schema: influx_bucket_entity_1.InfluxBucketSchema,
                },
            ]),
            (0, common_1.forwardRef)(() => influx_connections_module_1.InfluxConnectionsModule),
            (0, common_1.forwardRef)(() => clients_module_1.ClientsModule),
        ],
        controllers: [influx_buckets_controller_1.InfluxBucketsController],
        providers: [influx_buckets_service_1.InfluxBucketsService, influx_buckets_repository_1.InfluxBucketRepository],
        exports: [influx_buckets_service_1.InfluxBucketsService, influx_buckets_repository_1.InfluxBucketRepository],
    })
], InfluxBucketsModule);
exports.InfluxBucketsModule = InfluxBucketsModule;
//# sourceMappingURL=influx-buckets.module.js.map