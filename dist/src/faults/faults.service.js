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
var FaultsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaultsService = void 0;
const common_1 = require("@nestjs/common");
const influx_buckets_repository_1 = require("../influx-buckets/influx-buckets.repository");
const influx_connections_repository_1 = require("../influx-connections/influx-connections.repository");
const influx_service_1 = require("../influx/influx.service");
const ucs_repository_1 = require("../ucs/ucs.repository");
const fuso_map_1 = require("../utils/fuso-map");
let FaultsService = FaultsService_1 = class FaultsService {
    constructor(influxBucketRepository, influxConnectionRepository, influxService, ucRepository) {
        this.influxBucketRepository = influxBucketRepository;
        this.influxConnectionRepository = influxConnectionRepository;
        this.influxService = influxService;
        this.ucRepository = ucRepository;
        this.logger = new common_1.Logger(FaultsService_1.name);
    }
    async exportCSV({ ucs, dateRange, userId, }) {
        const foundUcs = (await this.ucRepository.findWherePopulate({ ucCode: { $in: ucs.split(',') }, deviceId: { $exists: true } }, ['deviceId', 'lastReceived', 'settings', 'transformerId']));
        if (foundUcs.length === 0) {
            throw {
                name: `QueryError`,
                message: `Não foi possível encontrar alguma UC selecionada.`,
            };
        }
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        const header = [
            'UC',
            'TR',
            'Alimentador',
            'Data Queda',
            'Hora Queda',
            'Contador de Queda',
            'Data Retorno',
            'Hora Retorno',
            'Contador de Retornos',
            'Tempo Fora',
        ];
        const devsIds = foundUcs.map((item) => `r["dev_id"] == "${item.deviceId.devId}"`);
        const bucket = await this.influxBucketRepository.findBucketById(foundUcs[0].deviceId.bucketId);
        if (!bucket) {
            throw {
                message: `Não foi possível encontrar um bucket.`,
            };
        }
        const influxConnection = await this.influxConnectionRepository.findById(bucket.influxConnectionId);
        if (!influxConnection) {
            throw {
                message: `Não foi possível encontrar uma conexão com o Influx.`,
            };
        }
        const data = await this.influxService.findFaultsFieldsByUcAndPeriod({
            devsIds: devsIds.join(' or '),
            begin: Math.round(new Date(startDate).getTime() / 1000),
            end: Math.round(new Date(endDate).getTime() / 1000),
            host: influxConnection.host,
            apiToken: influxConnection.apiToken,
            bucket: bucket.name,
        });
        const parsedData = [header];
        const parsedDataJson = data.map((item) => {
            const currentUc = foundUcs.find((element) => element.deviceId.devId == item.dev_id);
            item.energy_fall_time =
                item.energy_fall_time - fuso_map_1.timeZones[currentUc.timeZone] * 60 * 60;
            item.energy_return_time =
                item.energy_return_time - fuso_map_1.timeZones[currentUc.timeZone] * 60 * 60;
            const newItem = {
                uc: 0,
                timeZone: '',
                tr: '',
                feeder: '',
            };
            newItem.uc = Number(currentUc.ucCode);
            newItem.timeZone = currentUc.timeZone;
            newItem.tr = currentUc.transformerId?.it;
            newItem.feeder = currentUc.transformerId?.feeder;
            return { ...item, ...newItem };
        });
        for await (const row of parsedDataJson) {
            const fallTime = row.energy_fall_time * 1000;
            const returnTime = row.energy_return_time * 1000;
            parsedData.push([
                row.uc,
                row.tr,
                row.feeder,
                new Date(fallTime).toLocaleDateString('pt-Br', {
                    timeZone: row.timeZone,
                    dateStyle: 'short',
                }),
                new Date(fallTime).toLocaleTimeString('pt-Br', {
                    timeZone: row.timeZone,
                    timeStyle: 'medium',
                }),
                row.counter_fall,
                new Date(returnTime).toLocaleDateString('pt-Br', {
                    timeZone: row.timeZone,
                    dateStyle: 'short',
                }),
                new Date(returnTime).toLocaleTimeString('pt-Br', {
                    timeZone: row.timeZone,
                    timeStyle: 'medium',
                }),
                row.counter_return,
                row.energy_return_time - row.energy_fall_time,
            ]);
        }
        this.logger.log({
            message: 'Gerou arquivo de faltas',
            userId,
        });
        return { csvdoc: parsedData, jsondoc: parsedDataJson };
    }
};
FaultsService = FaultsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [influx_buckets_repository_1.InfluxBucketRepository,
        influx_connections_repository_1.InfluxConnectionRepository,
        influx_service_1.InfluxService,
        ucs_repository_1.UcsRepository])
], FaultsService);
exports.FaultsService = FaultsService;
//# sourceMappingURL=faults.service.js.map