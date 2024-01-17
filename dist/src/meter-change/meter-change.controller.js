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
exports.MeterChangeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const Role_1 = require("../auth/models/Role");
const create_meter_change_dto_1 = require("./dto/create-meter-change.dto");
const update_meter_change_dto_1 = require("./dto/update-meter-change.dto");
const meter_change_service_1 = require("./meter-change.service");
let MeterChangeController = class MeterChangeController {
    constructor(meterChangeService) {
        this.meterChangeService = meterChangeService;
    }
    async create(CreateMeterChangeDto) {
        try {
            return await this.meterChangeService.create(CreateMeterChangeDto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Erro ao cadastrar uma troca de medidor.', common_1.HttpStatus.BAD_REQUEST, {
                cause: error,
            });
        }
    }
    async findAll(user) {
        try {
            return this.meterChangeService.findAll(user);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Erro ao buscar todas as trocas de medidores.', common_1.HttpStatus.BAD_REQUEST, {
                cause: error,
            });
        }
    }
    findOne(id) {
        try {
            return this.meterChangeService.findOne(id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Erro ao buscar troca de medidor.', common_1.HttpStatus.BAD_REQUEST, {
                cause: error,
            });
        }
    }
    update(id, updateMeterChangeDto) {
        try {
            return this.meterChangeService.update(id, updateMeterChangeDto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Erro ao atualizar a troca de medidor.', common_1.HttpStatus.BAD_REQUEST, {
                cause: error,
            });
        }
    }
    remove(ids) {
        const idsForDelete = ids.split(',');
        try {
            return this.meterChangeService.remove(idsForDelete);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Erro ao excluir troca(s) de medidor(es).', common_1.HttpStatus.BAD_REQUEST, {
                cause: error,
            });
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_meter_change_dto_1.CreateMeterChangeDto]),
    __metadata("design:returntype", Promise)
], MeterChangeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.VIEWER, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MeterChangeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MeterChangeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_meter_change_dto_1.UpdateMeterChangeDto]),
    __metadata("design:returntype", void 0)
], MeterChangeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':ids'),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MeterChangeController.prototype, "remove", null);
MeterChangeController = __decorate([
    (0, swagger_1.ApiTags)('Troca de medidor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('meter-changes'),
    __metadata("design:paramtypes", [meter_change_service_1.MeterChangeService])
], MeterChangeController);
exports.MeterChangeController = MeterChangeController;
//# sourceMappingURL=meter-change.controller.js.map