"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaultsModule = void 0;
const common_1 = require("@nestjs/common");
const faults_service_1 = require("./faults.service");
const faults_controller_1 = require("./faults.controller");
const influx_buckets_module_1 = require("../influx-buckets/influx-buckets.module");
const influx_connections_module_1 = require("../influx-connections/influx-connections.module");
const influx_module_1 = require("../influx/influx.module");
const ucs_module_1 = require("../ucs/ucs.module");
let FaultsModule = class FaultsModule {
};
FaultsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            influx_buckets_module_1.InfluxBucketsModule,
            influx_connections_module_1.InfluxConnectionsModule,
            influx_module_1.InfluxModule,
            ucs_module_1.UcsModule,
        ],
        controllers: [faults_controller_1.FaultsController],
        providers: [faults_service_1.FaultsService],
    })
], FaultsModule);
exports.FaultsModule = FaultsModule;
//# sourceMappingURL=faults.module.js.map