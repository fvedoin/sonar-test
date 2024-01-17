"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateDataExportCSV = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const MAX_UCS_90_DAYS = 3;
const MAX_UCS_60_DAYS = 5;
const MAX_UCS_30_DAYS = 10;
const MAX_UCS_1_DAY = 100;
const getMaxDaysByUcs = (ucs) => {
    if (ucs >= 100) {
        return 1;
    }
    else if (ucs >= 10) {
        return 30;
    }
    else if (ucs >= 5) {
        return 60;
    }
    else if (ucs >= 3) {
        return 90;
    }
    return 0;
};
let ValidateDataExportCSV = class ValidateDataExportCSV {
    isQueryValid(ucs, days) {
        if ((ucs <= MAX_UCS_90_DAYS && days <= 90) ||
            (ucs <= MAX_UCS_60_DAYS && days <= 60) ||
            (ucs <= MAX_UCS_30_DAYS && days <= 30) ||
            (ucs <= MAX_UCS_1_DAY && days <= 1)) {
            return true;
        }
        else {
            return false;
        }
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { ucCodes, dateRange, fields, communication } = request.body;
        const startDateTime = new Date(dateRange.startDate).getTime();
        const endDateTime = new Date(dateRange.endDate).getTime();
        const dayInMiliseconds = 24 * 60 * 60 * 1000;
        const intervalDate = endDateTime - startDateTime;
        const days = intervalDate / dayInMiliseconds;
        const ucs = (ucCodes || []).length;
        if (!fields.length && !communication.length) {
            throw new common_1.BadRequestException(`Deve ser selecionado pelo menos um campo para gerar o arquivo!`);
        }
        if (!ucs) {
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
ValidateDataExportCSV = __decorate([
    (0, common_1.Injectable)()
], ValidateDataExportCSV);
exports.ValidateDataExportCSV = ValidateDataExportCSV;
//# sourceMappingURL=validateDataExportCSV.interceptor.js.map