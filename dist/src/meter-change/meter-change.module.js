"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeterChangeModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const meter_change_entity_1 = require("./entities/meter-change.entity");
const meter_change_controller_1 = require("./meter-change.controller");
const meter_change_repository_1 = require("./meter-change.repository");
const meter_change_service_1 = require("./meter-change.service");
let MeterChangeModule = class MeterChangeModule {
};
MeterChangeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: meter_change_entity_1.MeterChanges.name,
                    schema: meter_change_entity_1.MeterChangeSchema,
                },
            ]),
        ],
        controllers: [meter_change_controller_1.MeterChangeController],
        providers: [meter_change_service_1.MeterChangeService, meter_change_repository_1.MeterChangeRepository],
        exports: [meter_change_service_1.MeterChangeService, meter_change_repository_1.MeterChangeRepository],
    })
], MeterChangeModule);
exports.MeterChangeModule = MeterChangeModule;
//# sourceMappingURL=meter-change.module.js.map