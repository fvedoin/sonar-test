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
exports.GatewaysController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const Role_1 = require("../auth/models/Role");
const link_gateway_dto_1 = require("./dto/link-gateway.dto");
const gateways_service_1 = require("./gateways.service");
const common_2 = require("@nestjs/common");
let GatewaysController = class GatewaysController {
    constructor(gatewaysService) {
        this.gatewaysService = gatewaysService;
    }
    async findAll(user) {
        try {
            return await this.gatewaysService.findAll(user);
        }
        catch (error) {
            throw new common_2.HttpException({
                status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Ocorreu um erro ao buscar os gateways.',
                error: error.message,
            }, common_2.HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error,
            });
        }
    }
    filterByClients(user, clientId) {
        try {
            return this.gatewaysService.filterByClients(user, clientId);
        }
        catch (error) {
            throw new common_2.HttpException({
                status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Ocorreu um erro ao buscar os gateways para o cliente.',
                error: error.message,
            }, common_2.HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error,
            });
        }
    }
    async findOne(ttnId) {
        try {
            return await this.gatewaysService.findOne(ttnId);
        }
        catch (error) {
            throw new common_2.HttpException({
                status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Ocorreu um erro ao buscar o gateway por ID.',
                error: error.message,
            }, common_2.HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error,
            });
        }
    }
    async update(ttnId, linkGatewayDto) {
        try {
            return await this.gatewaysService.link(ttnId, linkGatewayDto);
        }
        catch (error) {
            throw new common_2.HttpException({
                status: common_2.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Ocorreu um erro ao atualizar o gateway.',
                error: error.message,
            }, common_2.HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: error,
            });
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.VIEWER, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GatewaysController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('filterByClients'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GatewaysController.prototype, "filterByClients", null);
__decorate([
    (0, common_1.Get)('ttn/:ttnId'),
    __param(0, (0, common_1.Param)('ttnId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GatewaysController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':ttnId/link'),
    __param(0, (0, common_1.Param)('ttnId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, link_gateway_dto_1.LinkGatewayDto]),
    __metadata("design:returntype", Promise)
], GatewaysController.prototype, "update", null);
GatewaysController = __decorate([
    (0, swagger_1.ApiTags)('Gateways'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN, Role_1.Role.ADMIN, Role_1.Role.MANAGER),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('gateways'),
    __metadata("design:paramtypes", [gateways_service_1.GatewaysService])
], GatewaysController);
exports.GatewaysController = GatewaysController;
//# sourceMappingURL=gateways.controller.js.map