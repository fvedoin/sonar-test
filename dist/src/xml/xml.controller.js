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
exports.XmlController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const xml_service_1 = require("./xml.service");
const generate_csv_quality_dto_1 = require("./dto/generate-csv-quality.dto");
const generate_csv_dto_1 = require("./dto/generate-csv.dto");
const validateDataExportCSV_interceptor_1 = require("../common/interceptors/validateDataExportCSV.interceptor");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let XmlController = class XmlController {
    constructor(xmlService) {
        this.xmlService = xmlService;
    }
    async generateCSVQuality(data, user) {
        try {
            return await this.xmlService.generateCSVQuality({
                ...data,
                fields: data.fields.sort(),
                user,
            });
        }
        catch (err) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Não foi possível exportar o arquivo CSV de qualidade!',
                stacktrace: err.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: err,
            });
        }
    }
    async generateCSV(data, user) {
        try {
            return await this.xmlService.generateCSV({
                ...data,
                fields: data.fields.sort(),
                user,
            });
        }
        catch (err) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Não foi possível exportar o arquivo CSV de faturamento ou medidas instântaneas!',
                stacktrace: err.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: err,
            });
        }
    }
};
__decorate([
    (0, common_1.Post)('export-csv-quality'),
    (0, common_1.UseInterceptors)(validateDataExportCSV_interceptor_1.ValidateDataExportCSV),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_csv_quality_dto_1.GenerateCSVQuality, Object]),
    __metadata("design:returntype", Promise)
], XmlController.prototype, "generateCSVQuality", null);
__decorate([
    (0, common_1.Post)('export-csv'),
    (0, common_1.UseInterceptors)(validateDataExportCSV_interceptor_1.ValidateDataExportCSV),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_csv_dto_1.GenerateCSV, Object]),
    __metadata("design:returntype", Promise)
], XmlController.prototype, "generateCSV", null);
XmlController = __decorate([
    (0, swagger_1.ApiTags)('Xml'),
    (0, common_1.Controller)('xml'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [xml_service_1.XmlService])
], XmlController);
exports.XmlController = XmlController;
//# sourceMappingURL=xml.controller.js.map