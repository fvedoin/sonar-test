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
exports.ApiAccessControlController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_access_control_service_1 = require("./api-access-control.service");
const create_api_access_control_dto_1 = require("./dto/create-api-access-control.dto");
const update_api_access_control_dto_1 = require("./dto/update-api-access-control.dto");
let ApiAccessControlController = class ApiAccessControlController {
    constructor(apiAccessControlService) {
        this.apiAccessControlService = apiAccessControlService;
    }
    create(createApiAccessControlDto) {
        return this.apiAccessControlService.create(createApiAccessControlDto);
    }
    findAll() {
        return this.apiAccessControlService.findAll();
    }
    findOne(id) {
        return this.apiAccessControlService.findOne(id);
    }
    update(id, updateApiAccessControlDto) {
        return this.apiAccessControlService.update(id, updateApiAccessControlDto);
    }
    remove(id) {
        return this.apiAccessControlService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_api_access_control_dto_1.CreateApiAccessControlDto]),
    __metadata("design:returntype", void 0)
], ApiAccessControlController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApiAccessControlController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApiAccessControlController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_api_access_control_dto_1.UpdateApiAccessControlDto]),
    __metadata("design:returntype", void 0)
], ApiAccessControlController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApiAccessControlController.prototype, "remove", null);
ApiAccessControlController = __decorate([
    (0, swagger_1.ApiTags)('Api-Useall'),
    (0, common_1.Controller)('api-access-control'),
    __metadata("design:paramtypes", [api_access_control_service_1.ApiAccessControlService])
], ApiAccessControlController);
exports.ApiAccessControlController = ApiAccessControlController;
//# sourceMappingURL=api-access-control.controller.js.map