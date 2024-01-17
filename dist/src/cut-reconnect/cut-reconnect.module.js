"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CutReconnectModule = void 0;
const common_1 = require("@nestjs/common");
const cut_reconnect_repository_1 = require("./cut-reconnect.repository");
const cut_reconnect_controller_1 = require("./cut-reconnect.controller");
const cut_reconnect_service_1 = require("./cut-reconnect.service");
const mongoose_1 = require("@nestjs/mongoose");
const cut_reconnect_entity_1 = require("./entities/cut-reconnect.entity");
let CutReconnectModule = class CutReconnectModule {
};
CutReconnectModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: cut_reconnect_entity_1.CutReconnect.name,
                    schema: cut_reconnect_entity_1.CutReconnectSchema,
                },
            ]),
        ],
        controllers: [cut_reconnect_controller_1.CutReconnectController],
        providers: [cut_reconnect_service_1.CutReconnectService, cut_reconnect_repository_1.CutConnectRepository],
        exports: [cut_reconnect_service_1.CutReconnectService, cut_reconnect_repository_1.CutConnectRepository],
    })
], CutReconnectModule);
exports.CutReconnectModule = CutReconnectModule;
//# sourceMappingURL=cut-reconnect.module.js.map