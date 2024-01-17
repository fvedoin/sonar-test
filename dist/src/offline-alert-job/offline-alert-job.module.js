"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineAlertJobModule = void 0;
const common_1 = require("@nestjs/common");
const offline_alert_job_service_1 = require("./offline-alert-job.service");
const offline_alert_job_controller_1 = require("./offline-alert-job.controller");
const offline_alert_job_repository_1 = require("./offline-alert-job.repository");
const mongoose_1 = require("@nestjs/mongoose");
const offline_alert_job_entity_1 = require("./entities/offline-alert-job.entity");
let OfflineAlertJobModule = class OfflineAlertJobModule {
};
OfflineAlertJobModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: offline_alert_job_entity_1.OfflineAlertJob.name, schema: offline_alert_job_entity_1.OfflineAlertJobSchema },
            ]),
        ],
        controllers: [offline_alert_job_controller_1.OfflineAlertJobController],
        providers: [offline_alert_job_service_1.OfflineAlertJobService, offline_alert_job_repository_1.OfflineAlertJobRepository],
        exports: [offline_alert_job_repository_1.OfflineAlertJobRepository],
    })
], OfflineAlertJobModule);
exports.OfflineAlertJobModule = OfflineAlertJobModule;
//# sourceMappingURL=offline-alert-job.module.js.map