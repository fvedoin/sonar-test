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
exports.UcsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const Role_1 = require("../auth/models/Role");
const create_uc_dto_1 = require("./dto/create-uc.dto");
const update_uc_dto_1 = require("./dto/update-uc.dto");
const ucs_service_1 = require("./ucs.service");
const queryFindAll_dto_1 = require("./dto/queryFindAll.dto");
let UcsController = class UcsController {
    constructor(ucsService) {
        this.ucsService = ucsService;
    }
    async create(createUcDto, currentUser) {
        try {
            return await this.ucsService.create(createUcDto, currentUser);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Não foi possível inserir uc!', common_1.HttpStatus.BAD_REQUEST, {
                cause: error,
            });
        }
    }
    async createMany(data) {
        try {
            return await this.ucsService.updateByUcCodeOrInsert(data);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'Não foi possível inserir ucs!',
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: error,
            });
        }
    }
    async processCsv(body, file, currentUser) {
        try {
            const clientId = body.clientId || currentUser.clientId;
            const isAdmin = currentUser.accessLevel === 'admin';
            const userId = currentUser.id;
            return await this.ucsService.processCSV(file, clientId, isAdmin, userId);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.FORBIDDEN,
                error: 'Não foi possível ler o arquivo!',
            }, common_1.HttpStatus.FORBIDDEN, {
                cause: error,
            });
        }
    }
    findAll(query, currentUser) {
        return this.ucsService.findAll(currentUser, query);
    }
    findAllPaginated(query, currentUser) {
        return this.ucsService.findPaginated(currentUser, query);
    }
    findOne(id) {
        return this.ucsService.findByIdPopulate(id);
    }
    findOneByCode(ucCode) {
        return this.ucsService.findWhere({ ucCode });
    }
    findOneBy(ucCode) {
        return this.ucsService.findWhereDetails({ ucCode });
    }
    findAllByClientId(clientId) {
        return this.ucsService.findWhere({
            clientId,
            deviceId: { $exists: true, $ne: null },
        });
    }
    update(id, updateUcDto, currentUser) {
        return this.ucsService.update(id, updateUcDto, currentUser);
    }
    async disable(user, id, { deleteData }) {
        try {
            return this.ucsService.disable(id, deleteData, user);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.FORBIDDEN,
                error: 'Erro ao desativar dispositivo da UC.',
            }, common_1.HttpStatus.FORBIDDEN, {
                cause: error,
            });
        }
    }
    async changeDevice(user, id, { deleteData, deviceId }) {
        try {
            if (!deviceId) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'DeviceId é obrigatório.',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            return this.ucsService.changeDevice({ id, deviceId, deleteData, user });
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.FORBIDDEN,
                error: 'Erro ao trocar dispositivo da UC.',
            }, common_1.HttpStatus.FORBIDDEN, {
                cause: error,
            });
        }
    }
    remove(id) {
        return this.ucsService.removeOne(id);
    }
    removeMany(id) {
        try {
            const ids = id.split(',');
            return this.ucsService.removeMany(ids);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'Não foi possível remover as ucs!',
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: error,
            });
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_uc_dto_1.CreateUcDto, Object]),
    __metadata("design:returntype", Promise)
], UcsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('many'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UcsController.prototype, "createMany", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                clientId: {
                    type: 'string',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiResponse)({
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                clientId: { type: 'string' },
                transformerId: { type: 'string' },
                transformer: { type: 'string' },
                ucCode: { type: 'string' },
                timeZone: { type: 'string' },
                location: { type: 'boolean' },
                ucNumber: { type: 'boolean' },
                ucClass: { type: 'string' },
                subclass: { type: 'string' },
                billingGroup: { type: 'string' },
                group: { type: 'string' },
                routeCode: { type: 'string' },
                sequence: { type: 'string' },
                phases: { type: 'string' },
                circuitBreaker: { type: 'string' },
                microgeneration: { type: 'string' },
                district: { type: 'string' },
                city: { type: 'string' },
                subGroup: { type: 'string' },
                operation: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [new common_1.FileTypeValidator({ fileType: 'csv' })],
    }))),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UcsController.prototype, "processCsv", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.VIEWER, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queryFindAll_dto_1.QueryFindAllDto, Object]),
    __metadata("design:returntype", void 0)
], UcsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('paginate'),
    (0, roles_decorator_1.Roles)(Role_1.Role.VIEWER, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [queryFindAll_dto_1.QueryFindAllPaginateDto, Object]),
    __metadata("design:returntype", void 0)
], UcsController.prototype, "findAllPaginated", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, roles_decorator_1.Roles)(Role_1.Role.VIEWER, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UcsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('/ucCode/:ucCode'),
    (0, roles_decorator_1.Roles)(Role_1.Role.VIEWER, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('ucCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UcsController.prototype, "findOneByCode", null);
__decorate([
    (0, common_1.Get)('/details/ucCode/:ucCode'),
    (0, roles_decorator_1.Roles)(Role_1.Role.VIEWER, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('ucCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UcsController.prototype, "findOneBy", null);
__decorate([
    (0, common_1.Get)('/client/:clientId'),
    (0, roles_decorator_1.Roles)(Role_1.Role.VIEWER, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UcsController.prototype, "findAllByClientId", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_uc_dto_1.UpdateUcDto, Object]),
    __metadata("design:returntype", void 0)
], UcsController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('disable/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UcsController.prototype, "disable", null);
__decorate([
    (0, common_1.Put)('change-device/:udId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('udId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UcsController.prototype, "changeDevice", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UcsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('/many/:ids'),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UcsController.prototype, "removeMany", null);
UcsController = __decorate([
    (0, swagger_1.ApiTags)('Ucs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('ucs'),
    __metadata("design:paramtypes", [ucs_service_1.UcsService])
], UcsController);
exports.UcsController = UcsController;
//# sourceMappingURL=ucs.controller.js.map