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
exports.UcdisabledHistoryController = void 0;
const common_1 = require("@nestjs/common");
const ucdisabled_history_service_1 = require("./ucdisabled-history.service");
const create_ucdisabled_history_dto_1 = require("./dto/create-ucdisabled-history.dto");
const find_ucdisabled_history_dto_1 = require("./dto/find-ucdisabled-history.dto");
const Role_1 = require("../auth/models/Role");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let UcdisabledHistoryController = class UcdisabledHistoryController {
    constructor(ucdisabledHistoryService) {
        this.ucdisabledHistoryService = ucdisabledHistoryService;
    }
    async create(createUcdisabledHistoryDto, session) {
        try {
            return this.ucdisabledHistoryService.create(createUcdisabledHistoryDto, session);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Erro ao criar histórico de UCs desativadas.',
                stacktrace: error.message,
            }, common_1.HttpStatus.BAD_REQUEST, { cause: error });
        }
    }
    findAll(query) {
        try {
            return this.ucdisabledHistoryService.findAll(query);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Não foi possível buscar o histórico de UCs desativadas.',
                stacktrace: error.message,
            }, common_1.HttpStatus.BAD_REQUEST, { cause: error });
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ucdisabled_history_dto_1.CreateUcdisabledHistoryDto, Object]),
    __metadata("design:returntype", Promise)
], UcdisabledHistoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.VIEWER, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_ucdisabled_history_dto_1.FindUcDisableHistoryDto]),
    __metadata("design:returntype", void 0)
], UcdisabledHistoryController.prototype, "findAll", null);
UcdisabledHistoryController = __decorate([
    (0, common_1.Controller)('ucdisabled-history'),
    __metadata("design:paramtypes", [ucdisabled_history_service_1.UcdisabledHistoryService])
], UcdisabledHistoryController);
exports.UcdisabledHistoryController = UcdisabledHistoryController;
//# sourceMappingURL=ucdisabled-history.controller.js.map