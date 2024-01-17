"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttAccessModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mqtt_access_entity_1 = require("./entities/mqtt-access.entity");
const mqtt_access_controller_1 = require("./mqtt-access.controller");
const mqtt_access_service_1 = require("./mqtt-access.service");
let MqttAccessModule = class MqttAccessModule {
};
MqttAccessModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: mqtt_access_entity_1.MqttAccess.name,
                    schema: mqtt_access_entity_1.MqttAccessSchema,
                },
            ]),
        ],
        controllers: [mqtt_access_controller_1.MqttAccessController],
        providers: [mqtt_access_service_1.MqttAccessService],
        exports: [mqtt_access_service_1.MqttAccessService],
    })
], MqttAccessModule);
exports.MqttAccessModule = MqttAccessModule;
//# sourceMappingURL=mqtt-access.module.js.map