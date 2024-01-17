"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateEnergyTotal = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let ValidateEnergyTotal = class ValidateEnergyTotal {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { uc: ucs, dateRange, field } = request.query;
        const startDateTime = new Date(dateRange.startDate).getTime();
        const endDateTime = new Date(dateRange.endDate).getTime();
        if (!field) {
            throw new common_1.BadRequestException(`Deve ter pelo menos um campo!`);
        }
        if (!ucs.length) {
            throw new common_1.BadRequestException(`Deve ser selecionado pelo menos uma UC!`);
        }
        if (endDateTime < startDateTime) {
            throw new common_1.BadRequestException(`A data final não pode ser menor que a data inicial!`);
        }
        return next.handle().pipe((0, operators_1.map)((data) => {
            return data;
        }));
    }
};
ValidateEnergyTotal = __decorate([
    (0, common_1.Injectable)()
], ValidateEnergyTotal);
exports.ValidateEnergyTotal = ValidateEnergyTotal;
//# sourceMappingURL=validateEnergyTotal.interceptor.js.map