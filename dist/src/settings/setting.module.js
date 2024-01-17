"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const setting_entity_1 = require("./entities/setting.entity");
const setting_repository_1 = require("./setting.repository");
const setting_controller_1 = require("./setting.controller");
const setting_service_1 = require("./setting.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const clients_module_1 = require("../clients/clients.module");
let SettingsModule = class SettingsModule {
};
SettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: setting_entity_1.Setting.name, schema: setting_entity_1.SettingSchema }]),
            clients_module_1.ClientsModule,
        ],
        controllers: [setting_controller_1.SettingsController],
        providers: [setting_service_1.SettingsService, setting_repository_1.SettingsRepository, event_emitter_1.EventEmitter2],
        exports: [setting_service_1.SettingsService],
    })
], SettingsModule);
exports.SettingsModule = SettingsModule;
//# sourceMappingURL=setting.module.js.map