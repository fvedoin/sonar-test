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
exports.InfluxBucketsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const Role_1 = require("../auth/models/Role");
const clients_service_1 = require("../clients/clients.service");
const create_influx_bucket_dto_1 = require("./dto/create-influx-bucket.dto");
const update_influx_bucket_dto_1 = require("./dto/update-influx-bucket.dto");
const influx_buckets_service_1 = require("./influx-buckets.service");
let InfluxBucketsController = class InfluxBucketsController {
    constructor(influxBucketsService, clientsService) {
        this.influxBucketsService = influxBucketsService;
        this.clientsService = clientsService;
    }
    async create(createInfluxBucketDto) {
        const { alias, influxConnectionId, clientId, product } = createInfluxBucketDto;
        const client = await this.clientsService.findOne(clientId);
        const searchRegExp = /\s/g;
        const bucket = {
            influxConnectionId,
            clientId,
            alias,
            product,
            name: `${client.name}-${product}`
                .replace(searchRegExp, '-')
                .toLowerCase(),
        };
        return this.influxBucketsService.create(bucket);
    }
    findOne(id) {
        return this.influxBucketsService.findOne(id);
    }
    update(id, updateInfluxBucketDto) {
        return this.influxBucketsService.update(id, updateInfluxBucketDto);
    }
    remove(id) {
        return this.influxBucketsService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_influx_bucket_dto_1.CreateInfluxBucketDto]),
    __metadata("design:returntype", Promise)
], InfluxBucketsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InfluxBucketsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_influx_bucket_dto_1.UpdateInfluxBucketDto]),
    __metadata("design:returntype", void 0)
], InfluxBucketsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InfluxBucketsController.prototype, "remove", null);
InfluxBucketsController = __decorate([
    (0, swagger_1.ApiTags)('Buckets InfluxDB'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('influx-buckets'),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => clients_service_1.ClientsService))),
    __metadata("design:paramtypes", [influx_buckets_service_1.InfluxBucketsService,
        clients_service_1.ClientsService])
], InfluxBucketsController);
exports.InfluxBucketsController = InfluxBucketsController;
//# sourceMappingURL=influx-buckets.controller.js.map