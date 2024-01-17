"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UcdisabledHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const ucdisabled_history_service_1 = require("./ucdisabled-history.service");
const ucdisabled_history_controller_1 = require("./ucdisabled-history.controller");
const ucdisabled_history_repository_1 = require("./ucdisabled-history.repository");
const mongoose_1 = require("@nestjs/mongoose");
const ucdisabled_history_entity_1 = require("./entities/ucdisabled-history.entity");
let UcdisabledHistoryModule = class UcdisabledHistoryModule {
};
UcdisabledHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: ucdisabled_history_entity_1.UcdisabledHistory.name, schema: ucdisabled_history_entity_1.UcdisabledHistorySchema },
            ]),
        ],
        controllers: [ucdisabled_history_controller_1.UcdisabledHistoryController],
        providers: [ucdisabled_history_service_1.UcdisabledHistoryService, ucdisabled_history_repository_1.UcdisabledHistoryRepository],
        exports: [ucdisabled_history_service_1.UcdisabledHistoryService],
    })
], UcdisabledHistoryModule);
exports.UcdisabledHistoryModule = UcdisabledHistoryModule;
//# sourceMappingURL=ucdisabled-history.module.js.map