"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const alerts_history_service_1 = require("./alerts-history.service");
const alerts_history_controller_1 = require("./alerts-history.controller");
const mongoose_1 = require("@nestjs/mongoose");
const alerts_history_entity_1 = require("./entities/alerts-history.entity");
const alerts_history_repository_1 = require("./alerts-history.repository");
const clients_module_1 = require("../clients/clients.module");
let AlertsHistoryModule = class AlertsHistoryModule {
};
AlertsHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => clients_module_1.ClientsModule),
            mongoose_1.MongooseModule.forFeature([
                { name: alerts_history_entity_1.AlertHistory.name, schema: alerts_history_entity_1.AlertsHistorySchema },
            ]),
        ],
        controllers: [alerts_history_controller_1.AlertsHistoryController],
        providers: [alerts_history_service_1.AlertsHistoryService, alerts_history_repository_1.AlertsHistoryRepository],
        exports: [alerts_history_repository_1.AlertsHistoryRepository],
    })
], AlertsHistoryModule);
exports.AlertsHistoryModule = AlertsHistoryModule;
//# sourceMappingURL=alerts-history.module.js.map