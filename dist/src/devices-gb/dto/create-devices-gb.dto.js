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
exports.CreateDevicesGbDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateDevicesGbDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "devId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "databaseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "devEui", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "appEui", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "lorawanVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "lorawanPhyVersion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "frequencyPlanId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "supportsJoin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "appKey", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], CreateDevicesGbDto.prototype, "topics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['LoRa', 'GSM'] }),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['ABNT NBR 14522', 'PIMA', 'Saída de usuário', 'DLMS'],
    }),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "communication", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], CreateDevicesGbDto.prototype, "allows", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "bucketId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "applicationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateDevicesGbDto.prototype, "brokerAttributeId", void 0);
exports.CreateDevicesGbDto = CreateDevicesGbDto;
//# sourceMappingURL=create-devices-gb.dto.js.map