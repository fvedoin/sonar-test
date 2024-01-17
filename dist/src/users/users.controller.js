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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const Role_1 = require("../auth/models/Role");
const clients_service_1 = require("../clients/clients.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_entity_1 = require("./entities/user.entity");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(usersService, clientsService) {
        this.usersService = usersService;
        this.clientsService = clientsService;
    }
    async create(createUserDto) {
        const { modules } = createUserDto;
        if (modules.findIndex((item) => item.includes('Telemedição')) < 0 &&
            modules.findIndex((item) => item === 'Faltas') >= 0) {
            throw {
                name: 'NotAllowedError',
                message: 'Para selecionar o módulo "Faltas", selecione também "Telemedição LoRa" ou "Telemedição GSM"!',
            };
        }
        return await this.usersService.create(createUserDto);
    }
    getMe(user) {
        return user;
    }
    async findAll(user) {
        if (user.accessLevel === Role_1.Role.ADMIN) {
            const clients = await this.clientsService.findWhere({
                parentId: user.clientId,
            });
            const whereClause = {
                $or: [
                    { clientId: user.clientId },
                    {
                        clientId: {
                            $in: clients.map((client) => client._id),
                        },
                    },
                ],
            };
            return this.usersService.findWhere(whereClause);
        }
        return this.usersService.findAll();
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    async generateChangeCode(userId) {
        try {
            return await this.usersService.generateCode(userId);
        }
        catch (err) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: err.message || 'Não possível gerar um codígo.',
                stacktrace: err.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: err,
            });
        }
    }
    async verifyCode(userId, { code }) {
        try {
            return await this.usersService.verifyCode(Number(code), userId);
        }
        catch (err) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: err.message || 'Não foi possível verificar o código!',
                stacktrace: err.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: err,
            });
        }
    }
    async updateProfile({ name, phone, oldImage, username, }, userId, image) {
        try {
            if (!username)
                throw new common_1.BadRequestException('Username deve ser informado.');
            return await this.usersService.updateProfile({
                name,
                userId,
                phone,
                oldImage,
                username,
                newImage: image,
            });
        }
        catch (err) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: err.message || 'Não possível atualizar o perfil.',
                stacktrace: err.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: err,
            });
        }
    }
    async getProfile(userId) {
        try {
            return await this.usersService.getProfile(userId);
        }
        catch (err) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: err.message || 'Não foi possível obter o perfil do usuário.',
                stacktrace: err.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: err,
            });
        }
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/generate-code'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                phone: { type: 'string' },
                username: { type: 'string' },
                image: { type: 'string' },
                _id: { type: 'string' },
                accessLevel: { type: 'string' },
                active: { type: 'boolean' },
                blocked: { type: 'boolean' },
                clientId: { type: 'string' },
                createdAt: { type: 'string' },
                modules: { type: 'array' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "generateChangeCode", null);
__decorate([
    (0, common_1.Put)(':id/verify-code'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                code: { type: 'number' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                phone: { type: 'string' },
                username: { type: 'string' },
                image: { type: 'string' },
                _id: { type: 'string' },
                accessLevel: { type: 'string' },
                active: { type: 'boolean' },
                blocked: { type: 'boolean' },
                clientId: { type: 'string' },
                createdAt: { type: 'string' },
                modules: { type: 'array' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verifyCode", null);
__decorate([
    (0, common_1.Put)(':id/profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                phone: { type: 'string' },
                username: { type: 'email' },
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                phone: { type: 'string' },
                username: { type: 'string' },
                image: { type: 'string' },
                _id: { type: 'string' },
                accessLevel: { type: 'string' },
                active: { type: 'boolean' },
                blocked: { type: 'boolean' },
                clientId: { type: 'string' },
                createdAt: { type: 'string' },
                modules: { type: 'array' },
            },
        },
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)(':id/profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN, Role_1.Role.ADMIN, Role_1.Role.MANAGER, Role_1.Role.SUPPORT, Role_1.Role.VIEWER),
    (0, swagger_1.ApiResponse)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                phone: { type: 'string' },
                username: { type: 'string' },
                image: { type: 'string' },
                _id: { type: 'string' },
                accessLevel: { type: 'string' },
                active: { type: 'boolean' },
                blocked: { type: 'boolean' },
                clientId: { type: 'string' },
                createdAt: { type: 'string' },
                modules: { type: 'array' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)('Usuários'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN, Role_1.Role.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        clients_service_1.ClientsService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map