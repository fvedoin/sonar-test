"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDevicesTrDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDevicesTrDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", Object)
], CreateDevicesTrDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", Object)
], CreateDevicesTrDto.prototype, "databaseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateDevicesTrDto.prototype, "devId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateDevicesTrDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateDevicesTrDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], CreateDevicesTrDto.prototype, "applicationId", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], CreateDevicesTrDto.prototype, "bucketId", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], CreateDevicesTrDto.prototype, "mqttApplicationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], CreateDevicesTrDto.prototype, "topics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesTrDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesTrDto.prototype, "password", void 0);
exports.CreateDevicesTrDto = CreateDevicesTrDto;
//# sourceMappingURL=create-devices-tr.dto.js.map