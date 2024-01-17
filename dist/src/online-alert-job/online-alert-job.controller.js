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
exports.OnlineAlertJobController = void 0;
const common_1 = require("@nestjs/common");
const online_alert_job_service_1 = require("./online-alert-job.service");
const create_online_alert_job_dto_1 = require("./dto/create-online-alert-job.dto");
const update_online_alert_job_dto_1 = require("./dto/update-online-alert-job.dto");
let OnlineAlertJobController = class OnlineAlertJobController {
    constructor(onlineAlertJobService) {
        this.onlineAlertJobService = onlineAlertJobService;
    }
    create(createOnlineAlertJobDto) {
        return this.onlineAlertJobService.create(createOnlineAlertJobDto);
    }
    findAll() {
        return this.onlineAlertJobService.findAll();
    }
    findOne(id) {
        return this.onlineAlertJobService.findOne(+id);
    }
    update(id, updateOnlineAlertJobDto) {
        return this.onlineAlertJobService.update(+id, updateOnlineAlertJobDto);
    }
    remove(id) {
        return this.onlineAlertJobService.remove(+id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_online_alert_job_dto_1.CreateOnlineAlertJobDto]),
    __metadata("design:returntype", void 0)
], OnlineAlertJobController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OnlineAlertJobController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnlineAlertJobController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_online_alert_job_dto_1.UpdateOnlineAlertJobDto]),
    __metadata("design:returntype", void 0)
], OnlineAlertJobController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnlineAlertJobController.prototype, "remove", null);
OnlineAlertJobController = __decorate([
    (0, common_1.Controller)('online-alert-job'),
    __metadata("design:paramtypes", [online_alert_job_service_1.OnlineAlertJobService])
], OnlineAlertJobController);
exports.OnlineAlertJobController = OnlineAlertJobController;
//# sourceMappingURL=online-alert-job.controller.js.map