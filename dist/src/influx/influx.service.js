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
exports.InfluxService = void 0;
const common_1 = require("@nestjs/common");
const influx_repository_1 = require("./influx.repository");
const utils_1 = require("./utils");
const queryGetAllData_1 = require("./utils/queryGetAllData");
const axios_1 = require("axios");
const findAnalyticsFields_1 = require("./utils/findAnalyticsFields");
const DATABASE_NAME = 'fox-iot';
let InfluxService = class InfluxService {
    constructor(influxRepository) {
        this.influxRepository = influxRepository;
    }
    async getConnection(url, token) {
        const client = await this.influxRepository.connection(url, token);
        if (!client) {
            throw new Error('Influx connection not found');
        }
        return client;
    }
    async getQuery(queryApi, query) {
        const result = await queryApi.collectRows(query);
        if (!result) {
            throw new Error('Influx query not found');
        }
        return result;
    }
    async lastHour(lastHourDto) {
        const query = (0, utils_1.queryVoltage)(lastHourDto.bucket, lastHourDto.devId);
        return this.executeQuery(lastHourDto.host, lastHourDto.apiToken, DATABASE_NAME, query);
    }
    async findQuality(findQualityDto) {
        const query = (0, utils_1.queryFindQuality)(findQualityDto);
        return this.executeQuery(process.env.INFLUX_HOST, process.env.INFLUX_API_TOKEN, DATABASE_NAME, query);
    }
    async findFaultsFieldsByUcAndPeriod(findFaultsDto) {
        const query = (0, utils_1.findDrpDrcByUcAndPeriod)(findFaultsDto);
        return this.executeQuery(findFaultsDto.host, findFaultsDto.apiToken, DATABASE_NAME, query);
    }
    async findAnalyticsFieldData(findAnalyticsDTO) {
        const query = (0, findAnalyticsFields_1.default)(findAnalyticsDTO);
        return this.executeQuery(findAnalyticsDTO.host, findAnalyticsDTO.apiToken, DATABASE_NAME, query);
    }
    async dashboardQuality(dashboardQualityDto) {
        const query = (0, utils_1.queryDashboardQuality)(dashboardQualityDto);
        return this.executeQuery(process.env.INFLUX_HOST, process.env.INFLUX_API_TOKEN, DATABASE_NAME, query);
    }
    async findFields(findFieldsDto) {
        const queryFields = (0, utils_1.queryFindFields)(findFieldsDto);
        const dataResult = await this.executeQuery(process.env.INFLUX_HOST, process.env.INFLUX_API_TOKEN, DATABASE_NAME, queryFields);
        return { dataResult };
    }
    async findFieldsCommunication(findFieldsDto) {
        const queryCommunication = (0, utils_1.queryFindCommunication)(findFieldsDto);
        const dataResult = await this.executeQuery(process.env.INFLUX_HOST, process.env.INFLUX_API_TOKEN, DATABASE_NAME, queryCommunication);
        return { dataResult };
    }
    async getConsume(getConsumeDto) {
        const query = (0, utils_1.queryConsume)(getConsumeDto);
        return this.executeQuery(process.env.INFLUX_HOST, process.env.INFLUX_API_TOKEN, DATABASE_NAME, query);
    }
    async getAllDataByDevId(data) {
        const query = (0, queryGetAllData_1.default)(data);
        return axios_1.default.post(data.host + '/api/v2/query', query, {
            params: {
                orgID: data.orgId,
                chunked: 'true',
                chunk_size: '10000',
            },
            responseType: 'stream',
            headers: {
                Accept: 'application/csv',
                'Content-type': 'application/vnd.flux',
                Authorization: `Token ${data.apiToken}`,
            },
        });
    }
    async deleteOldDataByDevId(data) {
        return axios_1.default.post(data.host + '/api/v2/delete', {
            predicate: `"dev_id" = "${data.devId}"`,
            start: new Date(0).toISOString(),
            stop: new Date().toISOString(),
        }, {
            params: {
                orgID: data.orgId,
                bucket: data.bucketName,
            },
            headers: {
                Authorization: `Token ${data.apiToken}`,
                encoding: 'json',
                Accept: 'application/json',
                'Content-type': 'application/json',
            },
        });
    }
    async executeQuery(url, token, dbName, query) {
        const client = await this.getConnection(url, token);
        const queryApi = client.getQueryApi(dbName);
        return this.getQuery(queryApi, query);
    }
};
InfluxService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [influx_repository_1.InfluxRepository])
], InfluxService);
exports.InfluxService = InfluxService;
//# sourceMappingURL=influx.service.js.map