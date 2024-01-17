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
exports.AwsS3ManagerController = void 0;
const common_1 = require("@nestjs/common");
const aws_s3_manager_service_1 = require("./aws-s3-manager.service");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let AwsS3ManagerController = class AwsS3ManagerController {
    constructor(s3Service) {
        this.s3Service = s3Service;
    }
    async getFile(key) {
        try {
            return await this.s3Service.getUrlFile(key);
        }
        catch (err) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Não foi possível buscar o arquivo!',
                stacktrace: err.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: err,
            });
        }
    }
    async getFiles(user) {
        try {
            const prefix = `${user.username}`;
            return await this.s3Service.getListFiles(prefix);
        }
        catch (err) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Não foi possível buscar os arquivos!',
                stacktrace: err.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: err,
            });
        }
    }
};
__decorate([
    (0, common_1.Get)('file/:key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AwsS3ManagerController.prototype, "getFile", null);
__decorate([
    (0, common_1.Get)('file'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AwsS3ManagerController.prototype, "getFiles", null);
AwsS3ManagerController = __decorate([
    (0, common_1.Controller)('s3'),
    __metadata("design:paramtypes", [aws_s3_manager_service_1.AwsS3ManagerService])
], AwsS3ManagerController);
exports.AwsS3ManagerController = AwsS3ManagerController;
//# sourceMappingURL=aws-s3-manager.controller.js.map