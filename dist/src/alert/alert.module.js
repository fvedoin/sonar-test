"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertModule = void 0;
const common_1 = require("@nestjs/common");
const alert_service_1 = require("./alert.service");
const alert_controller_1 = require("./alert.controller");
const mongoose_1 = require("@nestjs/mongoose");
const alert_entity_1 = require("./entities/alert.entity");
const alert_repository_1 = require("./alert.repository");
let AlertModule = class AlertModule {
};
AlertModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: alert_entity_1.Alert.name,
                    schema: alert_entity_1.AlertSchema,
                },
            ]),
        ],
        controllers: [alert_controller_1.AlertController],
        providers: [alert_service_1.AlertService, alert_repository_1.AlertRepository],
        exports: [alert_repository_1.AlertRepository],
    })
], AlertModule);
exports.AlertModule = AlertModule;
//# sourceMappingURL=alert.module.js.map