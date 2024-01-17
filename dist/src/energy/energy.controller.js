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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyController = void 0;
const common_1 = require("@nestjs/common");
const energy_service_1 = require("./energy.service");
const influx_connections_service_1 = require("../influx-connections/influx-connections.service");
const influx_buckets_service_1 = require("../influx-buckets/influx-buckets.service");
const ucs_service_1 = require("../ucs/ucs.service");
const meter_change_repository_1 = require("../meter-change/meter-change.repository");
const validateEnergyTotal_interceptor_1 = require("../common/interceptors/validateEnergyTotal.interceptor");
let EnergyController = class EnergyController {
    constructor(energyService, ucsService, influxConnection, influxBuckets, meterChange) {
        this.energyService = energyService;
        this.ucsService = ucsService;
        this.influxConnection = influxConnection;
        this.influxBuckets = influxBuckets;
        this.meterChange = meterChange;
    }
    async findEnergy(uc, field, timeGroup, dateRange) {
        const start = new Date(dateRange.startDate.substring(0, 11) + '03:00:00.000Z');
        const end = new Date(dateRange.endDate.substring(0, 11) + '20:59:59.000Z');
        const foundUcs = await this.ucsService.findByUcCodesPopulate(uc);
        const devsIds = foundUcs.map((item) => item.deviceId.devId);
        const bucket = await this.influxBuckets.findOne(foundUcs[0].deviceId.bucketId);
        const influxConnection = await this.influxConnection.findOne(bucket.influxConnectionId);
        const meterChanges = await this.meterChange.find({
            deviceId: { $in: foundUcs.map((item) => item.deviceId._id) },
            changedAt: { $gte: start, $lte: end },
        });
        const header = ['UC'].concat(field);
        const response = [['Date', 'Time'].concat(header)];
        let data = [];
        const hasMeterUpdates = meterChanges.length > 0;
        if (!hasMeterUpdates) {
            data = await this.energyService.findEnergy({
                field,
                devsIds,
                begin: Math.round(new Date(start).getTime() / 1000),
                end: Math.round(new Date(end).getTime() / 1000),
                group: timeGroup,
                urlDb: influxConnection.host,
                tokenDb: influxConnection.apiToken,
                bucket: bucket.name,
            });
        }
        if (hasMeterUpdates) {
            for await (const meterChange of meterChanges) {
                const beforeChange = await this.energyService.findEnergy({
                    field,
                    devsIds,
                    begin: Math.round(new Date(start).getTime() / 1000),
                    end: timeGroup === '1h'
                        ? Math.round(new Date(meterChange.changedAt).setMinutes(0, 0) / 1000)
                        : Math.round(new Date(meterChange.changedAt).setHours(0, 0, 0) / 1000),
                    group: timeGroup,
                    urlDb: influxConnection.host,
                    tokenDb: influxConnection.apiToken,
                    bucket: bucket.name,
                });
                const changeMoment = await this.energyService.findEnergy({
                    field,
                    devsIds,
                    begin: timeGroup === '1h'
                        ? Math.round(new Date(meterChange.changedAt).setMinutes(0, 0) / 1000)
                        : Math.round(new Date(meterChange.changedAt).setHours(0, 0, 0) / 1000),
                    end: timeGroup === '1h'
                        ? Math.round(new Date(meterChange.changedAt).setMinutes(60, 0) / 1000)
                        : Math.round(new Date(meterChange.changedAt).setHours(24, 0, 0) / 1000),
                    group: timeGroup,
                    urlDb: influxConnection.host,
                    tokenDb: influxConnection.apiToken,
                    bucket: bucket.name,
                });
                const afterChange = await this.energyService.findEnergy({
                    field,
                    devsIds,
                    begin: timeGroup === '1h'
                        ? Math.round(new Date(meterChange.changedAt).setMinutes(60, 0) / 1000)
                        : Math.round(new Date(meterChange.changedAt).setHours(24, 0, 0) / 1000),
                    end: Math.round(new Date(end).getTime() / 1000),
                    group: timeGroup,
                    urlDb: influxConnection.host,
                    tokenDb: influxConnection.apiToken,
                    bucket: bucket.name,
                });
                data = [...beforeChange, ...changeMoment, ...afterChange];
            }
        }
        for await (const item of data.filter((row) => row.result === '_result')) {
            const formattedDate = new Date(item._time).toLocaleDateString('pt-Br', {
                dateStyle: 'short',
                timeZone: 'America/Sao_Paulo',
            });
            const formattedTime = new Date(item._time).toLocaleTimeString('pt-Br', {
                timeStyle: 'medium',
                timeZone: 'America/Sao_Paulo',
            });
            const ucCode = Number(foundUcs.find((element) => item.dev_id === element.deviceId.devId)
                ?.ucCode);
            const value = item['_value'];
            const newLine = [formattedDate, formattedTime, ucCode];
            if (value || typeof value === 'number') {
                if (typeof value === 'number') {
                    const formattedValue = new Intl.NumberFormat('pt-BR', {
                        style: 'decimal',
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                    })
                        .format(value)
                        .replace('.', ',');
                    newLine.push(formattedValue);
                }
                else {
                    newLine.push(value);
                }
            }
            else {
                newLine.push(null);
            }
            response.push(newLine);
        }
        return response;
    }
    async findEnergyTotal(uc, field, dateRange) {
        const start = new Date(dateRange.startDate.substring(0, 11) + '03:00:00.000Z');
        const end = new Date(dateRange.endDate.substring(0, 11) + '20:59:59.000Z');
        const foundUcs = await this.ucsService.findByUcCodesPopulate(uc);
        const devsIds = foundUcs.map((item) => item.deviceId.devId);
        if (!foundUcs.length)
            throw new common_1.NotFoundException('UC not found.');
        const bucket = await this.influxBuckets.findOne(foundUcs[0].deviceId.bucketId);
        const influxConnection = await this.influxConnection.findOne(bucket.influxConnectionId);
        const data = await this.energyService.findEnergyTotal({
            field,
            devsIds,
            begin: Math.round(start.getTime() / 1000),
            end: Math.round(end.getTime() / 1000),
            urlDb: influxConnection.host,
            tokenDb: influxConnection.apiToken,
            bucket: bucket.name,
        });
        const response = data.find((item) => item.result === '_result');
        return response;
    }
    async findEnergyPredictionTotal(uc, field, dateRange) {
        const startDate = dateRange.startDate;
        const endDate = dateRange.endDate;
        const foundUcs = await this.ucsService.findByUcCodesPopulate(uc);
        const devsIds = foundUcs.map((item) => item.deviceId.devId);
        const urlDb = 'https://influxdb-analytics.dev.spinon.com.br';
        const tokenDb = 'j5e67MfZPqCGIrepobO2iJs-nOB-4JEBoW_QBfd0Hu7ohNZRzv_Bi59L_2tQwWr-dhD2CMrzRlycabepUxjNKg==';
        const bucket = 'mux-energia-telemedicao-b-predicts';
        const energyPredictionTotalData = await this.energyService.findEnergyPredictionTotal({
            begin: startDate,
            end: endDate,
            bucket,
            devsIds,
            field,
            tokenDb,
            urlDb,
        });
        return energyPredictionTotalData.find((item) => item.result === '_result');
    }
    async findEnergyPrediction(uc, field, timeGroup, dateRange) {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        const header = ['UC', field];
        const response = [['Data', 'Hora', ...header]];
        const urlDb = 'https://influxdb-analytics.dev.spinon.com.br';
        const tokenDb = 'j5e67MfZPqCGIrepobO2iJs-nOB-4JEBoW_QBfd0Hu7ohNZRzv_Bi59L_2tQwWr-dhD2CMrzRlycabepUxjNKg==';
        const bucket = 'mux-energia-telemedicao-b-predicts';
        const foundUcs = await this.ucsService.findByUcCodesPopulate(uc);
        const devsIds = foundUcs.map((item) => item.deviceId.devId);
        const energyPredictionData = await this.energyService.findEnergyPrediction({
            begin: startDate.getTime(),
            end: endDate.getTime(),
            bucket,
            devsIds,
            field,
            group: timeGroup,
            tokenDb,
            urlDb,
        });
        for (const energyPredictionItem of energyPredictionData) {
            if (typeof energyPredictionItem === 'object' &&
                energyPredictionItem !== null &&
                'result' in energyPredictionItem &&
                'dev_id' in energyPredictionItem &&
                '_time' in energyPredictionItem) {
                const formattedDate = new Date(energyPredictionItem._time).toLocaleDateString('pt-Br', {
                    dateStyle: 'short',
                    timeZone: 'America/Sao_Paulo',
                });
                const formattedTime = new Date(energyPredictionItem._time).toLocaleTimeString('pt-Br', {
                    timeStyle: 'medium',
                    timeZone: 'America/Sao_Paulo',
                });
                const ucCode = Number(foundUcs.find((element) => energyPredictionItem.dev_id == element.deviceId.devId).ucCode);
                const resultRow = [formattedDate, formattedTime, ucCode];
                let newValue;
                if (!energyPredictionItem['_value']) {
                    newValue = null;
                }
                if (typeof energyPredictionItem['_value'] !== 'number') {
                    newValue = energyPredictionItem['_value'];
                }
                else {
                    const formattedValue = new Intl.NumberFormat('pt-BR', {
                        style: 'decimal',
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                    })
                        .format(energyPredictionItem['_value'])
                        .replace('.', ',');
                    newValue = formattedValue;
                }
                resultRow.push(newValue);
                response.push(resultRow);
            }
        }
        return response;
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('uc')),
    __param(1, (0, common_1.Query)('field')),
    __param(2, (0, common_1.Query)('timeGroup')),
    __param(3, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String, Object]),
    __metadata("design:returntype", Promise)
], EnergyController.prototype, "findEnergy", null);
__decorate([
    (0, common_1.Get)('total-consumption'),
    (0, common_1.UseInterceptors)(validateEnergyTotal_interceptor_1.ValidateEnergyTotal),
    __param(0, (0, common_1.Query)('uc')),
    __param(1, (0, common_1.Query)('field')),
    __param(2, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, Object]),
    __metadata("design:returntype", Promise)
], EnergyController.prototype, "findEnergyTotal", null);
__decorate([
    (0, common_1.Get)('ia/total-consumption'),
    __param(0, (0, common_1.Query)('uc')),
    __param(1, (0, common_1.Query)('field')),
    __param(2, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, Object]),
    __metadata("design:returntype", Promise)
], EnergyController.prototype, "findEnergyPredictionTotal", null);
__decorate([
    (0, common_1.Get)('ia'),
    __param(0, (0, common_1.Query)('uc')),
    __param(1, (0, common_1.Query)('field')),
    __param(2, (0, common_1.Query)('timeGroup')),
    __param(3, (0, common_1.Query)('dateRange')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String, Object]),
    __metadata("design:returntype", Promise)
], EnergyController.prototype, "findEnergyPrediction", null);
EnergyController = __decorate([
    (0, common_1.Controller)('energy'),
    __metadata("design:paramtypes", [energy_service_1.EnergyService,
        ucs_service_1.UcsService,
        influx_connections_service_1.InfluxConnectionsService,
        influx_buckets_service_1.InfluxBucketsService,
        meter_change_repository_1.MeterChangeRepository])
], EnergyController);
exports.EnergyController = EnergyController;
//# sourceMappingURL=energy.controller.js.map