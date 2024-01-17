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
exports.DevicesTrController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const Role_1 = require("../auth/models/Role");
const clients_service_1 = require("../clients/clients.service");
const mqtt_access_service_1 = require("../mqtt-access/mqtt-access.service");
const devices_tr_service_1 = require("./devices-tr.service");
const find_devices_tr_dto_1 = require("./dto/find-devices-tr.dto");
const find_device_tr_analytcs_dto_1 = require("./dto/find-device-tr-analytcs.dto");
let DevicesTrController = class DevicesTrController {
    constructor(devicesTrService, clientsService, mqttAccessesService) {
        this.devicesTrService = devicesTrService;
        this.clientsService = clientsService;
        this.mqttAccessesService = mqttAccessesService;
    }
    async findAll({ clientId }, user) {
        let whereClause = {};
        if (clientId) {
            whereClause = { clientId };
        }
        else {
            if (user.accessLevel === Role_1.Role.ADMIN) {
                const clients = await this.clientsService.findWhere({
                    parentId: user.clientId,
                });
                whereClause = {
                    clientId: {
                        $in: [user.clientId, ...clients.map((client) => client._id)],
                    },
                };
            }
            else if (user.accessLevel !== Role_1.Role.SUPER_ADMIN &&
                user.accessLevel !== Role_1.Role.SUPPORT) {
                whereClause = { clientId: user.clientId };
            }
        }
        return this.devicesTrService.findWhere(whereClause);
    }
    findFilteredDevicesTr(user) {
        return this.devicesTrService.findFilteredDevicesTr(user);
    }
    findFilteredTransformerTelikTrafoLite(user, clientId) {
        return this.devicesTrService.findFilteredTransformerTelikTrafoLite(user, clientId);
    }
    findFilteredTransformerDevices(user, clientId) {
        return this.devicesTrService.findFilteredTransformerDevices(user, clientId);
    }
    getTelikTrafoLiteDevices(user) {
        return this.devicesTrService.findTelikTrafoLiteDevices(user);
    }
    getAnalytics(query) {
        try {
            return this.devicesTrService.getAnalytics(query);
        }
        catch (err) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_GATEWAY,
                message: 'Não foi possível buscar a análise de tr!',
                stacktrace: err.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: err,
            });
        }
    }
    async findOne(id) {
        const device = await this.devicesTrService.findOne(id);
        const broker = await this.mqttAccessesService.findOneWhere({
            devId: device.devId,
        });
        return { device, broker };
    }
    remove(ids) {
        return this.devicesTrService.remove(ids.split(','));
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_devices_tr_dto_1.FindDevicesTrDto, Object]),
    __metadata("design:returntype", Promise)
], DevicesTrController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('devices'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DevicesTrController.prototype, "findFilteredDevicesTr", null);
__decorate([
    (0, common_1.Get)('filter-telik-trafo-lite'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DevicesTrController.prototype, "findFilteredTransformerTelikTrafoLite", null);
__decorate([
    (0, common_1.Get)('filter-devices'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DevicesTrController.prototype, "findFilteredTransformerDevices", null);
__decorate([
    (0, common_1.Get)('telik-trafo-lite'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DevicesTrController.prototype, "getTelikTrafoLiteDevices", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_device_tr_analytcs_dto_1.FindDeviceTrAnalyticsDto]),
    __metadata("design:returntype", void 0)
], DevicesTrController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DevicesTrController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':ids'),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevicesTrController.prototype, "remove", null);
DevicesTrController = __decorate([
    (0, swagger_1.ApiTags)('Medidores de transformadores'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN, Role_1.Role.ADMIN, Role_1.Role.MANAGER, Role_1.Role.SUPPORT, Role_1.Role.VIEWER),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('devices-tr'),
    __metadata("design:paramtypes", [devices_tr_service_1.DevicesTrService,
        clients_service_1.ClientsService,
        mqtt_access_service_1.MqttAccessService])
], DevicesTrController);
exports.DevicesTrController = DevicesTrController;
//# sourceMappingURL=devices-tr.controller.js.map