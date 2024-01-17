"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlineAlertJobModule = void 0;
const common_1 = require("@nestjs/common");
const online_alert_job_service_1 = require("./online-alert-job.service");
const online_alert_job_controller_1 = require("./online-alert-job.controller");
const mongoose_1 = require("@nestjs/mongoose");
const online_alert_job_entity_1 = require("./entities/online-alert-job.entity");
const job_repository_1 = require("./job.repository");
let OnlineAlertJobModule = class OnlineAlertJobModule {
};
OnlineAlertJobModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: online_alert_job_entity_1.OnlineAlertJob.name, schema: online_alert_job_entity_1.OnlineAlertJobSchema },
            ]),
        ],
        controllers: [online_alert_job_controller_1.OnlineAlertJobController],
        providers: [online_alert_job_service_1.OnlineAlertJobService, job_repository_1.OnlineAlertJobRepository],
        exports: [job_repository_1.OnlineAlertJobRepository],
    })
], OnlineAlertJobModule);
exports.OnlineAlertJobModule = OnlineAlertJobModule;
//# sourceMappingURL=online-alert-job.module.js.map