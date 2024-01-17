"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyModule = void 0;
const common_1 = require("@nestjs/common");
const energy_service_1 = require("./energy.service");
const energy_controller_1 = require("./energy.controller");
const ucs_module_1 = require("../ucs/ucs.module");
const influx_buckets_module_1 = require("../influx-buckets/influx-buckets.module");
const influx_connections_module_1 = require("../influx-connections/influx-connections.module");
const meter_change_module_1 = require("../meter-change/meter-change.module");
let EnergyModule = class EnergyModule {
};
EnergyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ucs_module_1.UcsModule,
            influx_buckets_module_1.InfluxBucketsModule,
            influx_connections_module_1.InfluxConnectionsModule,
            meter_change_module_1.MeterChangeModule,
        ],
        controllers: [energy_controller_1.EnergyController],
        providers: [energy_service_1.EnergyService],
        exports: [energy_service_1.EnergyService],
    })
], EnergyModule);
exports.EnergyModule = EnergyModule;
//# sourceMappingURL=energy.module.js.map