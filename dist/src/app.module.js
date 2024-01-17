"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const event_emitter_1 = require("@nestjs/event-emitter");
const redisStore = require("cache-manager-redis-store");
const aws_sdk_v3_nest_1 = require("aws-sdk-v3-nest");
const client_s3_1 = require("@aws-sdk/client-s3");
const api_access_control_module_1 = require("./api-access-control/api-access-control.module");
const applications_module_1 = require("./applications/applications.module");
const area_module_1 = require("./area/area.module");
const auth_module_1 = require("./auth/auth.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const changelog_module_1 = require("./changelog/changelog.module");
const clients_module_1 = require("./clients/clients.module");
const common_module_1 = require("./common/common.module");
const database_module_1 = require("./common/database/database.module");
const devices_gb_module_1 = require("./devices-gb/devices-gb.module");
const devices_tr_module_1 = require("./devices-tr/devices-tr.module");
const gateways_module_1 = require("./gateways/gateways.module");
const influx_buckets_module_1 = require("./influx-buckets/influx-buckets.module");
const influx_connections_module_1 = require("./influx-connections/influx-connections.module");
const last_receiveds_module_1 = require("./last-receiveds/last-receiveds.module");
const meter_change_module_1 = require("./meter-change/meter-change.module");
const mqtt_access_module_1 = require("./mqtt-access/mqtt-access.module");
const news_module_1 = require("./news/news.module");
const notification_module_1 = require("./notification/notification.module");
const setting_module_1 = require("./settings/setting.module");
const transformers_module_1 = require("./transformers/transformers.module");
const ucs_module_1 = require("./ucs/ucs.module");
const users_module_1 = require("./users/users.module");
const xml_module_1 = require("./xml/xml.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const influx_module_1 = require("./influx/influx.module");
const energy_module_1 = require("./energy/energy.module");
const aws_s3_manager_module_1 = require("./aws-s3-manager/aws-s3-manager.module");
const alerts_history_module_1 = require("./alerts-history/alerts-history.module");
const token_module_1 = require("./token/token.module");
const rabbit_mq_module_1 = require("./rabbit-mq/rabbit-mq.module");
const offline_alert_job_module_1 = require("./offline-alert-job/offline-alert-job.module");
const job_module_1 = require("./job/job.module");
const online_alert_job_module_1 = require("./online-alert-job/online-alert-job.module");
const alert_module_1 = require("./alert/alert.module");
const ucdisabled_history_module_1 = require("./ucdisabled-history/ucdisabled-history.module");
const faults_module_1 = require("./faults/faults.module");
const alert_gateway_module_1 = require("./alert-gateway/alert-gateway.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            rabbit_mq_module_1.RabbitMQModule,
            aws_sdk_v3_nest_1.AwsSdkModule.register({
                isGlobal: true,
                client: new client_s3_1.S3Client({
                    region: process.env.AWS_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    },
                }),
            }),
            event_emitter_1.EventEmitterModule.forRoot({ wildcard: true, delimiter: '.' }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            database_module_1.DatabaseModule,
            common_1.CacheModule.register({
                isGlobal: true,
                store: redisStore,
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
            }),
            clients_module_1.ClientsModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            token_module_1.TokenModule,
            api_access_control_module_1.ApiAccessControlModule,
            influx_connections_module_1.InfluxConnectionsModule,
            influx_buckets_module_1.InfluxBucketsModule,
            common_module_1.CommonModule,
            news_module_1.NewsModule,
            notification_module_1.NotificationModule,
            mqtt_access_module_1.MqttAccessModule,
            transformers_module_1.TransformersModule,
            meter_change_module_1.MeterChangeModule,
            setting_module_1.SettingsModule,
            changelog_module_1.ChangelogsModule,
            ucs_module_1.UcsModule,
            xml_module_1.XmlModule,
            area_module_1.AreaModule,
            devices_gb_module_1.DevicesGbModule,
            applications_module_1.ApplicationsModule,
            last_receiveds_module_1.LastReceivedsModule,
            devices_tr_module_1.DevicesTrModule,
            gateways_module_1.GatewaysModule,
            dashboard_module_1.DashboardModule,
            influx_module_1.InfluxModule,
            energy_module_1.EnergyModule,
            aws_s3_manager_module_1.AwsS3ManagerModule,
            alerts_history_module_1.AlertsHistoryModule,
            offline_alert_job_module_1.OfflineAlertJobModule,
            job_module_1.JobModule,
            online_alert_job_module_1.OnlineAlertJobModule,
            alert_module_1.AlertModule,
            ucdisabled_history_module_1.UcdisabledHistoryModule,
            faults_module_1.FaultsModule,
            alert_gateway_module_1.AlertGatewayModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: common_1.CacheInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map