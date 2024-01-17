"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const clients_module_1 = require("../clients/clients.module");
const transformer_entity_1 = require("./entities/transformer.entity");
const transformers_controller_1 = require("./transformers.controller");
const transformers_service_1 = require("./transformers.service");
const transformers_repository_1 = require("./transformers.repository");
const users_module_1 = require("../users/users.module");
let TransformersModule = class TransformersModule {
};
TransformersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: transformer_entity_1.Transformer.name, schema: transformer_entity_1.TransformerSchema },
            ]),
            clients_module_1.ClientsModule,
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
        ],
        controllers: [transformers_controller_1.TransformersController],
        providers: [transformers_service_1.TransformersService, transformers_repository_1.TransformersRepository],
        exports: [transformers_service_1.TransformersService],
    })
], TransformersModule);
exports.TransformersModule = TransformersModule;
//# sourceMappingURL=transformers.module.js.map