"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const influx_buckets_module_1 = require("../influx-buckets/influx-buckets.module");
const influx_connections_module_1 = require("../influx-connections/influx-connections.module");
const clients_controller_1 = require("./clients.controller");
const clients_service_1 = require("./clients.service");
const client_entity_1 = require("./entities/client.entity");
const clients_repository_1 = require("./clients.repository");
let ClientsModule = class ClientsModule {
};
ClientsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: client_entity_1.Client.name, schema: client_entity_1.ClientSchema }]),
            (0, common_1.forwardRef)(() => influx_connections_module_1.InfluxConnectionsModule),
            (0, common_1.forwardRef)(() => influx_buckets_module_1.InfluxBucketsModule),
        ],
        controllers: [clients_controller_1.ClientsController],
        providers: [clients_service_1.ClientsService, clients_repository_1.ClientsRepository],
        exports: [clients_service_1.ClientsService],
    })
], ClientsModule);
exports.ClientsModule = ClientsModule;
//# sourceMappingURL=clients.module.js.map