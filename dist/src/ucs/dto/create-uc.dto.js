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
exports.CreateUcDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUcDto {
}
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUcDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUcDto.prototype, "transformerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUcDto.prototype, "deviceId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateUcDto.prototype, "billingGroup", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateUcDto.prototype, "routeCode", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateUcDto.prototype, "ratedVoltage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUcDto.prototype, "ucCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUcDto.prototype, "ucNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEnum)([
        'COMERCIAL',
        'CONSUMO PRÓPRIO',
        'ILUMINAÇÃO PÚBLICA',
        'INDUSTRIAL',
        'PODERES PÚBLICOS',
        'RESIDENCIAL',
        'RURAL',
        'SERVIÇO PÚBLICO',
    ]),
    __metadata("design:type", String)
], CreateUcDto.prototype, "ucClass", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUcDto.prototype, "subClass", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['A', 'B']),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUcDto.prototype, "group", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['A4', 'A4a', 'B1', 'B1r', 'B2', 'B3', 'B4a', 'B4b']),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUcDto.prototype, "subGroup", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUcDto.prototype, "sequence", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['A', 'B', 'C', 'AB', 'AC', 'BC', 'ABC']),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUcDto.prototype, "phases", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateUcDto.prototype, "circuitBreaker", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CreateUcDto.prototype, "microgeneration", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUcDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateUcDto.prototype, "district", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateUcDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateUcDto.prototype, "longitude", void 0);
exports.CreateUcDto = CreateUcDto;
//# sourceMappingURL=create-uc.dto.js.map