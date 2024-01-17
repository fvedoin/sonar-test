"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewaysModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const clients_module_1 = require("../clients/clients.module");
const gateway_entity_1 = require("./entities/gateway.entity");
const gateways_controller_1 = require("./gateways.controller");
const gateways_service_1 = require("./gateways.service");
const gateways_repository_1 = require("./gateways.repository");
let GatewaysModule = class GatewaysModule {
};
GatewaysModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: gateway_entity_1.Gateway.name, schema: gateway_entity_1.GatewaySchema }]),
            (0, common_1.forwardRef)(() => clients_module_1.ClientsModule),
        ],
        controllers: [gateways_controller_1.GatewaysController],
        providers: [gateways_service_1.GatewaysService, gateways_repository_1.GatewaysRepository],
    })
], GatewaysModule);
exports.GatewaysModule = GatewaysModule;
//# sourceMappingURL=gateways.module.js.map