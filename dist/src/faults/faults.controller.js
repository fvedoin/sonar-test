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
exports.FaultsController = void 0;
const common_1 = require("@nestjs/common");
const faults_service_1 = require("./faults.service");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let FaultsController = class FaultsController {
    constructor(faultsService) {
        this.faultsService = faultsService;
    }
    async exportCSV({ ucs, dateRange }, user) {
        try {
            const userId = user.id;
            if (!ucs.length) {
                throw {
                    message: `Nenhuma uc selecionada.`,
                };
            }
            if (!dateRange) {
                throw {
                    message: `DateRange é obrigatório.`,
                };
            }
            return await this.faultsService.exportCSV({ ucs, dateRange, userId });
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Ocorreu um erro ao exportar o CSV das faltas.',
                stacktrace: error.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: error,
            });
        }
    }
};
__decorate([
    (0, common_1.Get)('export-csv'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FaultsController.prototype, "exportCSV", null);
FaultsController = __decorate([
    (0, common_1.Controller)('faults'),
    __metadata("design:paramtypes", [faults_service_1.FaultsService])
], FaultsController);
exports.FaultsController = FaultsController;
//# sourceMappingURL=faults.controller.js.map