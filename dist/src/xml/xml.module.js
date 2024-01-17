"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlModule = void 0;
const common_1 = require("@nestjs/common");
const influx_buckets_module_1 = require("../influx-buckets/influx-buckets.module");
const influx_connections_module_1 = require("../influx-connections/influx-connections.module");
const ucs_module_1 = require("../ucs/ucs.module");
const xml_controller_1 = require("./xml.controller");
const xml_service_1 = require("./xml.service");
const createCSV_listener_1 = require("./listeners/createCSV.listener");
const influx_module_1 = require("../influx/influx.module");
const aws_s3_manager_module_1 = require("../aws-s3-manager/aws-s3-manager.module");
const notification_module_1 = require("../notification/notification.module");
let XmlModule = class XmlModule {
};
XmlModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ucs_module_1.UcsModule,
            influx_buckets_module_1.InfluxBucketsModule,
            influx_connections_module_1.InfluxConnectionsModule,
            influx_module_1.InfluxModule,
            aws_s3_manager_module_1.AwsS3ManagerModule,
            notification_module_1.NotificationModule,
        ],
        controllers: [xml_controller_1.XmlController],
        providers: [xml_service_1.XmlService, createCSV_listener_1.CreateCSVListener],
    })
], XmlModule);
exports.XmlModule = XmlModule;
//# sourceMappingURL=xml.module.js.map