"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesGbModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const applications_module_1 = require("../applications/applications.module");
const clients_module_1 = require("../clients/clients.module");
const influx_buckets_module_1 = require("../influx-buckets/influx-buckets.module");
const mqtt_access_module_1 = require("../mqtt-access/mqtt-access.module");
const devices_gb_controller_1 = require("./devices-gb.controller");
const devices_gb_service_1 = require("./devices-gb.service");
const devices_gb_entity_1 = require("./entities/devices-gb.entity");
const devices_gb_repository_1 = require("./devices-gb.repository");
const ucs_module_1 = require("../ucs/ucs.module");
const transformers_module_1 = require("../transformers/transformers.module");
const users_module_1 = require("../users/users.module");
const notification_module_1 = require("../notification/notification.module");
const alert_module_1 = require("../alert/alert.module");
const meter_change_module_1 = require("../meter-change/meter-change.module");
const cut_reconnect_module_1 = require("../cut-reconnect/cut-reconnect.module");
const last_receiveds_module_1 = require("../last-receiveds/last-receiveds.module");
const influx_connections_module_1 = require("../influx-connections/influx-connections.module");
const influx_module_1 = require("../influx/influx.module");
const offline_alert_job_module_1 = require("../offline-alert-job/offline-alert-job.module");
const online_alert_job_module_1 = require("../online-alert-job/online-alert-job.module");
const job_module_1 = require("../job/job.module");
const ucdisabled_history_module_1 = require("../ucdisabled-history/ucdisabled-history.module");
let DevicesGbModule = class DevicesGbModule {
};
DevicesGbModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: devices_gb_entity_1.DeviceGb.name, schema: devices_gb_entity_1.DeviceGbSchema },
            ]),
            (0, common_1.forwardRef)(() => ucs_module_1.UcsModule),
            (0, common_1.forwardRef)(() => clients_module_1.ClientsModule),
            (0, common_1.forwardRef)(() => applications_module_1.ApplicationsModule),
            (0, common_1.forwardRef)(() => influx_buckets_module_1.InfluxBucketsModule),
            (0, common_1.forwardRef)(() => mqtt_access_module_1.MqttAccessModule),
            transformers_module_1.TransformersModule,
            users_module_1.UsersModule,
            clients_module_1.ClientsModule,
            notification_module_1.NotificationModule,
            alert_module_1.AlertModule,
            meter_change_module_1.MeterChangeModule,
            cut_reconnect_module_1.CutReconnectModule,
            last_receiveds_module_1.LastReceivedsModule,
            offline_alert_job_module_1.OfflineAlertJobModule,
            online_alert_job_module_1.OnlineAlertJobModule,
            job_module_1.JobModule,
            ucdisabled_history_module_1.UcdisabledHistoryModule,
            influx_module_1.InfluxModule,
            influx_buckets_module_1.InfluxBucketsModule,
            influx_connections_module_1.InfluxConnectionsModule,
        ],
        controllers: [devices_gb_controller_1.DevicesGbController],
        providers: [devices_gb_service_1.DevicesGbService, devices_gb_repository_1.DevicesGbRepository],
        exports: [devices_gb_service_1.DevicesGbService, devices_gb_repository_1.DevicesGbRepository],
    })
], DevicesGbModule);
exports.DevicesGbModule = DevicesGbModule;
//# sourceMappingURL=devices-gb.module.js.map