"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UcsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const devices_gb_module_1 = require("../devices-gb/devices-gb.module");
const transformers_module_1 = require("../transformers/transformers.module");
const users_module_1 = require("../users/users.module");
const uc_entity_1 = require("./entities/uc.entity");
const ucs_controller_1 = require("./ucs.controller");
const ucs_service_1 = require("./ucs.service");
const ucs_repository_1 = require("./ucs.repository");
const clients_module_1 = require("../clients/clients.module");
const notification_module_1 = require("../notification/notification.module");
const influx_buckets_module_1 = require("../influx-buckets/influx-buckets.module");
const ucdisabled_history_module_1 = require("../ucdisabled-history/ucdisabled-history.module");
let UcsModule = class UcsModule {
};
UcsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: uc_entity_1.Uc.name, schema: uc_entity_1.UcSchema }]),
            (0, common_1.forwardRef)(() => devices_gb_module_1.DevicesGbModule),
            transformers_module_1.TransformersModule,
            users_module_1.UsersModule,
            clients_module_1.ClientsModule,
            notification_module_1.NotificationModule,
            ucdisabled_history_module_1.UcdisabledHistoryModule,
            influx_buckets_module_1.InfluxBucketsModule,
        ],
        controllers: [ucs_controller_1.UcsController],
        providers: [ucs_service_1.UcsService, ucs_repository_1.UcsRepository],
        exports: [ucs_service_1.UcsService, ucs_repository_1.UcsRepository],
    })
], UcsModule);
exports.UcsModule = UcsModule;
//# sourceMappingURL=ucs.module.js.map