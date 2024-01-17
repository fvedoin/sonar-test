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
exports.MqttAccessController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bcrypt = require("bcrypt");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const Role_1 = require("../auth/models/Role");
const create_mqtt_access_dto_1 = require("./dto/create-mqtt-access.dto");
const update_mqtt_access_dto_1 = require("./dto/update-mqtt-access.dto");
const mqtt_access_service_1 = require("./mqtt-access.service");
let MqttAccessController = class MqttAccessController {
    constructor(mqttAccessService) {
        this.mqttAccessService = mqttAccessService;
    }
    async create(createMqttAccessDto) {
        return this.mqttAccessService.create({
            ...createMqttAccessDto,
            encryptedPassword: await bcrypt.hash(createMqttAccessDto.encryptedPassword, 10),
        });
    }
    findAll() {
        return this.mqttAccessService.findAll();
    }
    findOne(id) {
        return this.mqttAccessService.findOne(id);
    }
    update(id, updateMqttAccessDto) {
        return this.mqttAccessService.update(id, updateMqttAccessDto);
    }
    clearStatus() {
        return this.mqttAccessService.clearStatus();
    }
    connect(devId) {
        return this.mqttAccessService.connect(devId);
    }
    disconnect(devId) {
        return this.mqttAccessService.disconnect(devId);
    }
    remove(id) {
        return this.mqttAccessService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_mqtt_access_dto_1.CreateMqttAccessDto]),
    __metadata("design:returntype", Promise)
], MqttAccessController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.VIEWER, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MqttAccessController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MqttAccessController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_mqtt_access_dto_1.UpdateMqttAccessDto]),
    __metadata("design:returntype", void 0)
], MqttAccessController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('clear-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MqttAccessController.prototype, "clearStatus", null);
__decorate([
    (0, common_1.Patch)('connect'),
    __param(0, (0, common_1.Body)('devId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MqttAccessController.prototype, "connect", null);
__decorate([
    (0, common_1.Patch)('disconnect'),
    __param(0, (0, common_1.Body)('devId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MqttAccessController.prototype, "disconnect", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MqttAccessController.prototype, "remove", null);
MqttAccessController = __decorate([
    (0, swagger_1.ApiTags)('MqttAccess'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('mqtt-access'),
    __metadata("design:paramtypes", [mqtt_access_service_1.MqttAccessService])
], MqttAccessController);
exports.MqttAccessController = MqttAccessController;
//# sourceMappingURL=mqtt-access.controller.js.map