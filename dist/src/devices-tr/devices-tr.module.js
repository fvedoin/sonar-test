"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesTrModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const clients_module_1 = require("../clients/clients.module");
const influx_buckets_module_1 = require("../influx-buckets/influx-buckets.module");
const mqtt_access_module_1 = require("../mqtt-access/mqtt-access.module");
const devices_tr_controller_1 = require("./devices-tr.controller");
const devices_tr_service_1 = require("./devices-tr.service");
const devices_tr_entity_1 = require("./entities/devices-tr.entity");
const devices_tr_repository_1 = require("./devices-tr.repository");
const influx_module_1 = require("../influx/influx.module");
const influx_connections_module_1 = require("../influx-connections/influx-connections.module");
const transformers_module_1 = require("../transformers/transformers.module");
let DevicesTrModule = class DevicesTrModule {
};
DevicesTrModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: devices_tr_entity_1.DeviceTr.name, schema: devices_tr_entity_1.DeviceTrSchema },
            ]),
            clients_module_1.ClientsModule,
            mqtt_access_module_1.MqttAccessModule,
            influx_buckets_module_1.InfluxBucketsModule,
            transformers_module_1.TransformersModule,
            influx_module_1.InfluxModule,
            influx_connections_module_1.InfluxConnectionsModule,
        ],
        controllers: [devices_tr_controller_1.DevicesTrController],
        providers: [devices_tr_service_1.DevicesTrService, devices_tr_repository_1.DevicesTrRepository],
    })
], DevicesTrModule);
exports.DevicesTrModule = DevicesTrModule;
//# sourceMappingURL=devices-tr.module.js.map