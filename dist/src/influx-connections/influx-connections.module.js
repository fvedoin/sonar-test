"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluxConnectionsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const influx_buckets_module_1 = require("../influx-buckets/influx-buckets.module");
const influx_connection_entity_1 = require("./entities/influx-connection.entity");
const influx_connections_controller_1 = require("./influx-connections.controller");
const influx_connections_service_1 = require("./influx-connections.service");
const influx_connections_repository_1 = require("./influx-connections.repository");
let InfluxConnectionsModule = class InfluxConnectionsModule {
};
InfluxConnectionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: influx_connection_entity_1.InfluxConnection.name,
                    schema: influx_connection_entity_1.InfluxConnectionSchema,
                },
            ]),
            (0, common_1.forwardRef)(() => influx_buckets_module_1.InfluxBucketsModule),
        ],
        controllers: [influx_connections_controller_1.InfluxConnectionsController],
        providers: [influx_connections_service_1.InfluxConnectionsService, influx_connections_repository_1.InfluxConnectionRepository],
        exports: [influx_connections_service_1.InfluxConnectionsService, influx_connections_repository_1.InfluxConnectionRepository],
    })
], InfluxConnectionsModule);
exports.InfluxConnectionsModule = InfluxConnectionsModule;
//# sourceMappingURL=influx-connections.module.js.map