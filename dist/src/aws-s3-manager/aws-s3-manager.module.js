"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3ManagerModule = void 0;
const common_1 = require("@nestjs/common");
const aws_s3_manager_service_1 = require("./aws-s3-manager.service");
const aws_s3_manager_controller_1 = require("./aws-s3-manager.controller");
const aws_s3_manager_repository_1 = require("./aws-s3-manager.repository");
let AwsS3ManagerModule = class AwsS3ManagerModule {
};
AwsS3ManagerModule = __decorate([
    (0, common_1.Module)({
        controllers: [aws_s3_manager_controller_1.AwsS3ManagerController],
        providers: [aws_s3_manager_service_1.AwsS3ManagerService, aws_s3_manager_repository_1.AwsS3ManagerRepository],
        exports: [aws_s3_manager_service_1.AwsS3ManagerService],
    })
], AwsS3ManagerModule);
exports.AwsS3ManagerModule = AwsS3ManagerModule;
//# sourceMappingURL=aws-s3-manager.module.js.map