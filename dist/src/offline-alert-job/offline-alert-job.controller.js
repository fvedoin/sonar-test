"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineAlertJobController = void 0;
const common_1 = require("@nestjs/common");
const offline_alert_job_service_1 = require("./offline-alert-job.service");
const create_offline_alert_job_dto_1 = require("./dto/create-offline-alert-job.dto");
const update_offline_alert_job_dto_1 = require("./dto/update-offline-alert-job.dto");
let OfflineAlertJobController = class OfflineAlertJobController {
    constructor(offlineAlertJobService) {
        this.offlineAlertJobService = offlineAlertJobService;
    }
    create(createOfflineAlertJobDto) {
        return this.offlineAlertJobService.create(createOfflineAlertJobDto);
    }
    findAll() {
        return this.offlineAlertJobService.findAll();
    }
    findOne(id) {
        return this.offlineAlertJobService.findOne(+id);
    }
    update(id, updateOfflineAlertJobDto) {
        return this.offlineAlertJobService.update(+id, updateOfflineAlertJobDto);
    }
    remove(id) {
        return this.offlineAlertJobService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_offline_alert_job_dto_1.CreateOfflineAlertJobDto]),
    __metadata("design:returntype", void 0)
], OfflineAlertJobController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OfflineAlertJobController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OfflineAlertJobController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_offline_alert_job_dto_1.UpdateOfflineAlertJobDto]),
    __metadata("design:returntype", void 0)
], OfflineAlertJobController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OfflineAlertJobController.prototype, "remove", null);
OfflineAlertJobController = __decorate([
    (0, common_1.Controller)('offline-alert-job'),
    __metadata("design:paramtypes", [offline_alert_job_service_1.OfflineAlertJobService])
], OfflineAlertJobController);
exports.OfflineAlertJobController = OfflineAlertJobController;
//# sourceMappingURL=offline-alert-job.controller.js.map