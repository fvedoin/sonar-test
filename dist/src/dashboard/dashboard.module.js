"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const dashboard_controller_1 = require("./dashboard.controller");
const influx_module_1 = require("../influx/influx.module");
const ucs_module_1 = require("../ucs/ucs.module");
const influx_connections_module_1 = require("../influx-connections/influx-connections.module");
const clients_module_1 = require("../clients/clients.module");
const influx_buckets_module_1 = require("../influx-buckets/influx-buckets.module");
const setting_module_1 = require("../settings/setting.module");
const last_receiveds_module_1 = require("../last-receiveds/last-receiveds.module");
const notification_module_1 = require("../notification/notification.module");
const cut_reconnect_module_1 = require("../cut-reconnect/cut-reconnect.module");
const energy_module_1 = require("../energy/energy.module");
let DashboardModule = class DashboardModule {
};
DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            clients_module_1.ClientsModule,
            cut_reconnect_module_1.CutReconnectModule,
            influx_buckets_module_1.InfluxBucketsModule,
            influx_connections_module_1.InfluxConnectionsModule,
            influx_module_1.InfluxModule,
            last_receiveds_module_1.LastReceivedsModule,
            notification_module_1.NotificationModule,
            setting_module_1.SettingsModule,
            ucs_module_1.UcsModule,
            energy_module_1.EnergyModule,
        ],
        controllers: [dashboard_controller_1.DashboardController],
        providers: [dashboard_service_1.DashboardService],
    })
], DashboardModule);
exports.DashboardModule = DashboardModule;
//# sourceMappingURL=dashboard.module.js.map