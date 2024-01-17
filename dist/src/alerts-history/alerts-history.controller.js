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
exports.AlertsHistoryController = void 0;
const common_1 = require("@nestjs/common");
const alerts_history_service_1 = require("./alerts-history.service");
const find_alerts_history_1 = require("./dto/find-alerts-history");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let AlertsHistoryController = class AlertsHistoryController {
    constructor(alertsHistoryService) {
        this.alertsHistoryService = alertsHistoryService;
    }
    async findAll(query, user) {
        try {
            return this.alertsHistoryService.findAll(query, user);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Erro ao buscar histórico de alertas.',
                stacktrace: error.message,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_alerts_history_1.FindAlertsHistoryDto, Object]),
    __metadata("design:returntype", Promise)
], AlertsHistoryController.prototype, "findAll", null);
AlertsHistoryController = __decorate([
    (0, common_1.Controller)('alertsHistory'),
    __metadata("design:paramtypes", [alerts_history_service_1.AlertsHistoryService])
], AlertsHistoryController);
exports.AlertsHistoryController = AlertsHistoryController;
//# sourceMappingURL=alerts-history.controller.js.map