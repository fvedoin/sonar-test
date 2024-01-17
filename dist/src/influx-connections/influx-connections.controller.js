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
exports.InfluxConnectionsController = void 0;
const influxdb_client_1 = require("@influxdata/influxdb-client");
const influxdb_client_apis_1 = require("@influxdata/influxdb-client-apis");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const Role_1 = require("../auth/models/Role");
const influx_buckets_service_1 = require("../influx-buckets/influx-buckets.service");
const create_influx_connection_dto_1 = require("./dto/create-influx-connection.dto");
const ping_influx_connection_dto_1 = require("./dto/ping-influx-connection.dto");
const update_influx_connection_dto_1 = require("./dto/update-influx-connection.dto");
const influx_connections_service_1 = require("./influx-connections.service");
let InfluxConnectionsController = class InfluxConnectionsController {
    constructor(influxConnectionsService, influxBucketsService) {
        this.influxConnectionsService = influxConnectionsService;
        this.influxBucketsService = influxBucketsService;
    }
    create(createInfluxConnectionDto) {
        return this.influxConnectionsService.create(createInfluxConnectionDto);
    }
    async ping(pingInfluxConnectionDto) {
        const timeout = 10 * 1000;
        const influxDB = new influxdb_client_1.InfluxDB({
            url: pingInfluxConnectionDto.host,
            timeout,
        });
        const pingAPI = new influxdb_client_apis_1.PingAPI(influxDB);
        return await pingAPI.getPing();
    }
    findAll() {
        return this.influxConnectionsService.findAll();
    }
    findOne(id) {
        return this.influxConnectionsService.findOne(id);
    }
    findBuckets(id) {
        return this.influxBucketsService.findByInfluxConnection(id);
    }
    async update(id, updateInfluxConnectionDto) {
        return await this.influxConnectionsService.update(id, updateInfluxConnectionDto);
    }
    remove(id) {
        return this.influxConnectionsService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_influx_connection_dto_1.CreateInfluxConnectionDto]),
    __metadata("design:returntype", void 0)
], InfluxConnectionsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('ping'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ping_influx_connection_dto_1.PingInfluxConnectionDto]),
    __metadata("design:returntype", Promise)
], InfluxConnectionsController.prototype, "ping", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.VIEWER, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.ADMIN, Role_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfluxConnectionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InfluxConnectionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/buckets'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InfluxConnectionsController.prototype, "findBuckets", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_influx_connection_dto_1.UpdateInfluxConnectionDto]),
    __metadata("design:returntype", Promise)
], InfluxConnectionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InfluxConnectionsController.prototype, "remove", null);
InfluxConnectionsController = __decorate([
    (0, swagger_1.ApiTags)('Conexões InfluxDB'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('influx-connections'),
    __metadata("design:paramtypes", [influx_connections_service_1.InfluxConnectionsService,
        influx_buckets_service_1.InfluxBucketsService])
], InfluxConnectionsController);
exports.InfluxConnectionsController = InfluxConnectionsController;
//# sourceMappingURL=influx-connections.controller.js.map