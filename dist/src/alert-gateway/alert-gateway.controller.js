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
exports.AlertGatewayController = void 0;
const common_1 = require("@nestjs/common");
const alert_gateway_service_1 = require("./alert-gateway.service");
const Role_1 = require("../auth/models/Role");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let AlertGatewayController = class AlertGatewayController {
    constructor(alertGatewayService) {
        this.alertGatewayService = alertGatewayService;
    }
    async remove(id) {
        try {
            const ids = id.split(',');
            await this.alertGatewayService.remove(ids);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Não foi possível deletar os alertas de gateways!',
                stacktrace: error.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: error,
            });
        }
    }
};
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AlertGatewayController.prototype, "remove", null);
AlertGatewayController = __decorate([
    (0, common_1.Controller)('alert-gateway'),
    __metadata("design:paramtypes", [alert_gateway_service_1.AlertGatewayService])
], AlertGatewayController);
exports.AlertGatewayController = AlertGatewayController;
//# sourceMappingURL=alert-gateway.controller.js.map