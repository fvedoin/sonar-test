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
exports.CreateCSVListener = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const papaparse_1 = require("papaparse");
const luxon_1 = require("luxon");
const influx_buckets_service_1 = require("../../influx-buckets/influx-buckets.service");
const influx_service_1 = require("../../influx/influx.service");
const CSVfields_map_1 = require("../../utils/CSVfields-map");
const event_create_csv_dto_1 = require("../dto/event-create-csv.dto");
const event_create_csv_quality_dto_1 = require("../dto/event-create-csv-quality.dto");
const aws_s3_manager_service_1 = require("../../aws-s3-manager/aws-s3-manager.service");
const notification_service_1 = require("../../notification/notification.service");
let CreateCSVListener = class CreateCSVListener {
    constructor(influxService, influxBucketsService, awsS3ManagerService, notificationService) {
        this.influxService = influxService;
        this.influxBucketsService = influxBucketsService;
        this.awsS3ManagerService = awsS3ManagerService;
        this.notificationService = notificationService;
    }
    getDateTime(unixTimeStamp, timeZone, format) {
        return luxon_1.DateTime.fromSeconds(unixTimeStamp, {
            zone: timeZone,
            locale: 'pt-BR',
        }).toFormat(format);
    }
    async saveInS3(data, user, nameFile) {
        const { username, clientId } = user;
        try {
            const bucket = process.env.AWS_BUCKET_CSV_FILES;
            const now = new Date().getTime();
            const buffer = Buffer.from(data, 'utf-8');
            const expirationDate = new Date().setDate(new Date().getDate() + 7);
            await this.awsS3ManagerService.uploadFile({
                Bucket: bucket,
                Key: `${username}-${now}-${nameFile}.csv`,
                Body: buffer,
                Expires: new Date(expirationDate),
            });
            await this.notificationService.create({
                title: 'Arquivo CSV gerado!',
                message: `O arquivo ${nameFile} foi gerado com sucesso`,
                clientId,
                createdAt: new Date(),
            });
        }
        catch (error) {
            await this.notificationService.create({
                title: 'Erro ao gerar arquivo CSV!',
                message: `O arquivo ${nameFile} não foi gerado com sucesso`,
                clientId,
                createdAt: new Date(),
            });
            throw new Error(error);
        }
    }
    generateQuery(items) {
        return (items || []).map((item) => `r["_field"] == "${item}"`).join(' or ');
    }
    convertItemsToLabels(items, measurements) {
        return (items || [])
            .map((item) => {
            const measurement = (measurements || []).find((m) => m.value === item);
            if (measurement)
                return measurement.label;
        })
            .filter((item) => !!item);
    }
    processFields(item, currentUc, sliceStart) {
        return Object.values(item)
            .slice(sliceStart)
            .map((fields) => (typeof fields === 'number' ? fields.toFixed(2) : ''));
    }
    combineData(parseData, parsedCommunicationFields, hasCommunication) {
        return parseData.map((dataItem, index) => {
            const communicationFields = hasCommunication
                ? parsedCommunicationFields[index].slice(3)
                : [];
            return [...dataItem, ...communicationFields];
        });
    }
    processDataItem(item, foundUcs, queryCommunication, sliceStart) {
        const currentUc = foundUcs.find((uc) => {
            const deviceId = uc.deviceId;
            return deviceId.devId === item.dev_id;
        });
        const unixTimeStamp = new Date(item._time).getTime() / 1000;
        const time = this.getDateTime(unixTimeStamp, currentUc.timeZone, 'HH:mm:ss');
        const date = this.getDateTime(unixTimeStamp, currentUc.timeZone, 'dd/MM/yyyy');
        const dataFields = queryCommunication
            ? this.processFields(item, currentUc, sliceStart)
            : [];
        return [date, time, currentUc.ucCode, ...dataFields];
    }
    async createCSV(data) {
        try {
            const { fields, dateRange, foundUcs, aggregation, user, nameFile, communication, } = data;
            const endDateTime = new Date(dateRange.endDate).getTime();
            const startDateTime = new Date(dateRange.startDate).getTime();
            const devsIds = foundUcs
                .map((uc) => {
                const deviceId = uc.deviceId;
                return `r["dev_id"] == "${deviceId.devId}"`;
            })
                .join(' or ');
            const queryFields = this.generateQuery(fields);
            const queryCommunication = this.generateQuery(communication);
            const { bucketId } = foundUcs[0].deviceId;
            const bucket = await this.influxBucketsService.findOne(bucketId.toString());
            const parseFields = this.convertItemsToLabels(fields, CSVfields_map_1.measurements);
            const parseCommunication = this.convertItemsToLabels(communication, CSVfields_map_1.measurements);
            const header = [
                'Data',
                'Hora',
                'UC',
                ...parseFields,
                ...parseCommunication,
            ];
            const dataFields = queryFields
                ? await this.influxService.findFields({
                    fields: queryFields,
                    devsIds,
                    begin: Math.round(startDateTime / 1000),
                    end: Math.round(endDateTime / 1000),
                    aggregation,
                    bucket: bucket.name,
                })
                : { dataResult: [] };
            const dataCommunication = queryCommunication
                ? await this.influxService.findFieldsCommunication({
                    communication: queryCommunication,
                    devsIds,
                    begin: Math.round(startDateTime / 1000),
                    end: Math.round(endDateTime / 1000),
                    aggregation,
                    bucket: bucket.name,
                })
                : { dataResult: [] };
            const parsedCommunicationFields = [];
            const parseData = [];
            const hasFields = fields && fields.length > 0;
            const hasCommunication = communication && communication.length > 0;
            dataCommunication.dataResult.forEach((item) => {
                const communicationFields = this.processDataItem(item, foundUcs, queryCommunication, 5);
                parsedCommunicationFields.push(communicationFields);
            });
            dataFields.dataResult.forEach((item) => {
                const dataFields = this.processDataItem(item, foundUcs, fields, 4);
                parseData.push(dataFields);
            });
            let combinedData = [];
            if (hasFields) {
                combinedData = this.combineData(parseData, parsedCommunicationFields, hasCommunication);
            }
            else if (hasCommunication) {
                combinedData = parsedCommunicationFields;
            }
            const csv = (0, papaparse_1.unparse)({
                fields: header,
                data: combinedData,
            }, {
                delimiter: ';',
            });
            this.saveInS3(csv, user, nameFile);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async createCSVQuality(data) {
        try {
            const { dateRange, fields, foundUcs, user, nameFile } = data;
            const endDateTime = new Date(dateRange.endDate).getTime();
            const startDateTime = new Date(dateRange.startDate).getTime();
            const devsIds = foundUcs
                .map((uc) => {
                const deviceId = uc.deviceId;
                return `r["dev_id"] == "${deviceId.devId}"`;
            })
                .join(' or ');
            const queryFields = fields
                .map((item) => `r["_field"] == "${item}"`)
                .join(' or ');
            const { bucketId } = foundUcs[0].deviceId;
            const bucket = await this.influxBucketsService.findOne(bucketId.toString(), undefined, { name: 1, _id: 0 });
            const parseFields = fields.map((item) => {
                const measurement = CSVfields_map_1.measurements.find((m) => m.value === item);
                return measurement.label;
            });
            const header = [
                'UC',
                'Data Início',
                'Hora Início',
                'Data Fim',
                'Hora Fim',
                ...parseFields,
            ];
            const dataInflux = await this.influxService.findQuality({
                fields: queryFields,
                devsIds,
                begin: Math.round(startDateTime / 1000),
                end: Math.round(endDateTime / 1000),
                bucket: bucket.name,
            });
            const parseData = dataInflux.map((item) => {
                const currentUc = foundUcs.find((uc) => {
                    const deviceId = uc.deviceId;
                    return deviceId.devId === item.dev_id;
                });
                const ucCode = currentUc.ucCode;
                const timeZone = currentUc.timeZone;
                const dateStart = this.getDateTime(item.quality_interval_start, timeZone, 'dd/MM/yyyy');
                const timeStart = this.getDateTime(item.quality_interval_start, timeZone, 'HH:mm:ss');
                const dateEnd = this.getDateTime(item.quality_interval_end, timeZone, 'dd/MM/yyyy');
                const timeEnd = this.getDateTime(item.quality_interval_end, timeZone, 'HH:mm:ss');
                return [
                    ucCode,
                    dateStart,
                    timeStart,
                    dateEnd,
                    timeEnd,
                    item.drp_phase_a?.toString(),
                    item.drp_phase_b?.toString(),
                    item.drp_phase_c?.toString(),
                    item.drc_phase_a?.toString(),
                    item.drc_phase_b?.toString(),
                    item.drc_phase_c?.toString(),
                ];
            });
            const csv = (0, papaparse_1.unparse)({
                fields: header,
                data: parseData,
            }, {
                delimiter: ';',
            });
            this.saveInS3(csv, user, nameFile);
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)('xml.generateCSV'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_create_csv_dto_1.EventCreateCSV]),
    __metadata("design:returntype", Promise)
], CreateCSVListener.prototype, "createCSV", null);
__decorate([
    (0, event_emitter_1.OnEvent)('xml.generateCSVQuality'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_create_csv_quality_dto_1.EventCreateCSVQuality]),
    __metadata("design:returntype", Promise)
], CreateCSVListener.prototype, "createCSVQuality", null);
CreateCSVListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [influx_service_1.InfluxService,
        influx_buckets_service_1.InfluxBucketsService,
        aws_s3_manager_service_1.AwsS3ManagerService,
        notification_service_1.NotificationService])
], CreateCSVListener);
exports.CreateCSVListener = CreateCSVListener;
//# sourceMappingURL=createCSV.listener.js.map