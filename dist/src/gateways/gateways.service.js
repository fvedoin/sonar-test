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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewaysService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const Role_1 = require("../auth/models/Role");
const ttn_service_1 = require("../common/services/ttn.service");
const gateways_repository_1 = require("./gateways.repository");
let GatewaysService = class GatewaysService {
    constructor(gatewayRepository) {
        this.gatewayRepository = gatewayRepository;
    }
    async getStatusForGateway(gateway) {
        return await ttn_service_1.TtnService.get(`gs/gateways/${gateway.ids.gateway_id}/connection/stats`);
    }
    async getLinkedInfoForGateway(gateway, user) {
        const whereClause = {
            ...(user.accessLevel !== Role_1.Role.SUPER_ADMIN &&
                user.accessLevel !== Role_1.Role.ADMIN &&
                user.accessLevel !== Role_1.Role.SUPPORT && { clientId: user.clientId }),
            ttnId: gateway.ids.gateway_id,
        };
        return await this.findOneWhere(whereClause, 'clientId');
    }
    shouldIncludeGateway(user, linked) {
        return (user.accessLevel === Role_1.Role.SUPER_ADMIN ||
            user.accessLevel === Role_1.Role.ADMIN ||
            user.accessLevel === Role_1.Role.SUPPORT ||
            !!linked);
    }
    async getDeviceInfo(gateway) {
        return await this.findOneWhere({ ttnId: gateway.ids.gateway_id });
    }
    formatGatewayData(gateway, status, linked, device) {
        return {
            lastSeen: status?.data?.last_status_received_at || '',
            online: !!linked && linked.online,
            client: linked?.clientId?.map((item) => item.name).join(', ') || null,
            coordinates: device?.location?.coordinates || null,
            ...gateway,
        };
    }
    async linkGateway(ttnId, linkGatewayDto) {
        const { latitude, longitude } = linkGatewayDto;
        const location = {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
        };
        return this.gatewayRepository.findOneAndUpdateWithArgs({ ttnId }, {
            location,
            ...linkGatewayDto,
        }, {
            upsert: true,
        });
    }
    async handleAdminRouteForFilteredGateways(clientId) {
        const ttnResponse = await ttn_service_1.TtnService.get('gateways?field_mask=name,description');
        const { gateways } = ttnResponse.data;
        const gatewayData = await this.gatewayRepository.find({ clientId });
        const ttnIds = gatewayData.map((gateway) => gateway.ttnId);
        const filteredGateways = gateways.filter((gateway) => {
            return ttnIds.includes(gateway.ids.gateway_id);
        });
        return filteredGateways;
    }
    async handleNonAdminRouteForFilteredGateways(user) {
        const clientId = user.clientId;
        const ttnResponse = await ttn_service_1.TtnService.get('gateways?field_mask=name,description');
        const { gateways } = ttnResponse.data;
        const gatewayData = await this.gatewayRepository.find({ clientId });
        const ttnIds = gatewayData.map((gateway) => gateway.ttnId);
        const filteredGateways = gateways.filter((gateway) => {
            return ttnIds.includes(gateway.ids.gateway_id);
        });
        return filteredGateways;
    }
    async findOneWhere(where, populate) {
        return this.gatewayRepository.findOneAndPopulate(where, populate);
    }
    async findAll(user) {
        const ttnResponse = await ttn_service_1.TtnService.get('gateways?field_mask=name,description,frequency_plan_ids,gateway_server_address');
        const { gateways } = ttnResponse.data;
        const response = await Promise.all(gateways.map(async (gateway) => {
            const status = await this.getStatusForGateway(gateway);
            const linked = await this.getLinkedInfoForGateway(gateway, user);
            if (!this.shouldIncludeGateway(user, linked)) {
                return null;
            }
            const device = await this.getDeviceInfo(gateway);
            return this.formatGatewayData(gateway, status, linked, device);
        }));
        return response.filter((item) => item !== null);
    }
    async filterByClients(user, clientId) {
        const isAdmin = user.accessLevel === 'admin';
        if (isAdmin) {
            return this.handleAdminRouteForFilteredGateways(clientId);
        }
        return this.handleNonAdminRouteForFilteredGateways(user);
    }
    async findOne(ttnId) {
        const gateway = await this.findOneWhere({ ttnId });
        const ttnResponse = await ttn_service_1.TtnService.get(`gateways/${ttnId}?field_mask=name,description`);
        if (gateway instanceof mongoose_1.default.Document) {
            return { ...gateway.toObject(), name: ttnResponse.data.name };
        }
        return { name: ttnResponse.data.name };
    }
    async link(ttnId, linkGatewayDto) {
        return await this.linkGateway(ttnId, linkGatewayDto);
    }
};
GatewaysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gateways_repository_1.GatewaysRepository])
], GatewaysService);
exports.GatewaysService = GatewaysService;
//# sourceMappingURL=gateways.service.js.map