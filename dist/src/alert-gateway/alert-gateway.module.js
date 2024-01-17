"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertGatewayModule = void 0;
const common_1 = require("@nestjs/common");
const alert_gateway_service_1 = require("./alert-gateway.service");
const alert_gateway_controller_1 = require("./alert-gateway.controller");
const alert_gateway_repository_1 = require("./alert-gateway.repository");
const mongoose_1 = require("@nestjs/mongoose");
const alert_gateway_entity_1 = require("./entities/alert-gateway.entity");
let AlertGatewayModule = class AlertGatewayModule {
};
AlertGatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: alert_gateway_entity_1.AlertGateway.name,
                    schema: alert_gateway_entity_1.AlertGatewaySchema,
                },
            ]),
        ],
        controllers: [alert_gateway_controller_1.AlertGatewayController],
        providers: [alert_gateway_service_1.AlertGatewayService, alert_gateway_repository_1.AlertGatewayRepository],
    })
], AlertGatewayModule);
exports.AlertGatewayModule = AlertGatewayModule;
//# sourceMappingURL=alert-gateway.module.js.map