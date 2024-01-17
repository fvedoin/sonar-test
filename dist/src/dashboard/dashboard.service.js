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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const influx_service_1 = require("../influx/influx.service");
const ucs_service_1 = require("../ucs/ucs.service");
const setting_service_1 = require("../settings/setting.service");
const last_receiveds_service_1 = require("../last-receiveds/last-receiveds.service");
const influx_buckets_service_1 = require("../influx-buckets/influx-buckets.service");
const notification_service_1 = require("../notification/notification.service");
const cut_reconnect_service_1 = require("../cut-reconnect/cut-reconnect.service");
const energy_service_1 = require("../energy/energy.service");
let DashboardService = class DashboardService {
    constructor(influxService, influxBucketsService, ucsService, settingsService, lastRecevedsService, notificationService, cutReconnectService, energyService) {
        this.influxService = influxService;
        this.influxBucketsService = influxBucketsService;
        this.ucsService = ucsService;
        this.settingsService = settingsService;
        this.lastRecevedsService = lastRecevedsService;
        this.notificationService = notificationService;
        this.cutReconnectService = cutReconnectService;
        this.energyService = energyService;
    }
    getMinAndMaxFromLastHour(lastHour) {
        const values = lastHour.map((item) => {
            return item._value;
        });
        return { min: Math.min(...values), max: Math.max(...values) };
    }
    async getLastYearConsume(bucketName, now, ucs, host, apiToken) {
        const lastYear = now.getFullYear() - 1;
        const start = new Date(lastYear, 7, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        const result = await this.fetchConsume(ucs, bucketName, host, apiToken, start, end);
        return result;
    }
    async getConsumedYearlyData(bucketName, now, year, ucs, host, apiToken) {
        const startCurrentMonth = new Date(year, now.getMonth());
        const endCurrentMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);
        const startLastMonth = new Date(year, now.getMonth() - 1);
        const endLastMonth = new Date(year, now.getMonth(), 0, 23, 59, 59);
        const [currentMonth, lastMonth] = await Promise.all([
            this.fetchConsume(ucs, bucketName, host, apiToken, startCurrentMonth, endCurrentMonth),
            this.fetchConsume(ucs, bucketName, host, apiToken, startLastMonth, endLastMonth),
        ]);
        return { currentMonth, lastMonth };
    }
    async getStatus(device, settings) {
        const dayInSeconds = 86400;
        const MinuteInSeconds = 60;
        const now = new Date().getTime();
        const offlineTime = settings.offlineTime * MinuteInSeconds || dayInSeconds;
        let status = 'Sem status';
        const responseLastReceived = await this.lastRecevedsService.find({
            deviceId: device._id,
        }, { _id: 0, receivedAt: 1 });
        const lastTimeUnix = Math.max(...responseLastReceived.map((item) => item.receivedAt.getTime()));
        if (device.devId.includes('ucd')) {
            status = 'Desabilitada';
        }
        else if (device.communication) {
            status = now - lastTimeUnix > offlineTime * 1000 ? 'Offline' : 'Online';
        }
        return status;
    }
    async fetchUcs(clientId) {
        const ucs = await this.ucsService.findWhere({ clientId, deviceId: { $exists: true } }, { _id: 0, ucCode: 1, deviceId: 1, ratedVoltage: 1 });
        return ucs.filter((uc) => !!uc.deviceId?.devId);
    }
    async fetchSettings(clientId) {
        try {
            return await this.settingsService.find({ clientId }, { _id: 0 });
        }
        catch (error) {
            return this.settingsService.getDefaultSettings();
        }
    }
    async fetchBucket(clientId) {
        return this.influxBucketsService.findOneWhere({
            clientId,
            product: 'telemedicao-b',
        });
    }
    async fetchNotifications(clientId) {
        return await this.notificationService.findByClientId(clientId, {
            _id: 0,
            message: 1,
            title: 1,
            createdAt: 1,
        });
    }
    async fetchConsume(ucs, bucketName, host, apiToken, start, end) {
        const devsIds = ucs.map((item) => item.deviceId.devId);
        const data = await this.energyService.findEnergyTotal({
            field: 'consumed_total_energy',
            devsIds: devsIds,
            begin: Math.round(start.getTime() / 1000),
            end: Math.round(end.getTime() / 1000),
            urlDb: host,
            tokenDb: apiToken,
            bucket: bucketName,
        });
        const response = data.find((item) => item.result === '_result');
        return response?._value ?? 0;
    }
    formatQualityResult(qualities, ucs) {
        const groupedData = {};
        for (const quality of qualities) {
            const { _value, _field, dev_id, result } = quality;
            if (!groupedData[result]) {
                groupedData[result] = {};
            }
            if (!groupedData[result][dev_id]) {
                groupedData[result][dev_id] = [];
            }
            const ucCode = this.getUcCodeByDevId(ucs, dev_id);
            const dataPoint = {
                value: _value,
                field: _field,
                devId: dev_id,
                ucCode,
            };
            groupedData[result][dev_id].push(dataPoint);
        }
        return groupedData;
    }
    getUcCodeByDevId(ucs, devId) {
        const uc = ucs.find((uc) => uc.deviceId.devId === devId);
        return uc.ucCode;
    }
    async fetchQuality(ucs, bucket) {
        const startDate = '-7d';
        const endDate = 'now()';
        const devsIds = ucs.map((item) => item.deviceId.devId);
        const quality = await this.influxService.dashboardQuality({
            bucket,
            devsIds,
            startDate,
            endDate,
        });
        return this.formatQualityResult(quality, ucs);
    }
    async fetchUcsData(uc, settings, bucket, host, apiToken) {
        const device = uc.deviceId;
        const lastHour = await this.influxService.lastHour({
            apiToken,
            bucket: bucket.name,
            devId: device.devId,
            host,
        });
        const lastHourData = this.getMinAndMaxFromLastHour(lastHour);
        const status = await this.getStatus(device, settings);
        const cutReconnect = await this.cutReconnectService.findWhere({
            deviceId: device._id,
        });
        return {
            ...uc,
            lastHour: lastHourData,
            status,
            cutReconnect,
        };
    }
    async fetchConsumeData(bucketName, ucs, host, apiToken) {
        const now = new Date();
        const [currentYearMonths, lastYearMonths, lastYear] = await Promise.all([
            this.getConsumedYearlyData(bucketName, now, now.getFullYear(), ucs, host, apiToken),
            this.getConsumedYearlyData(bucketName, now, now.getFullYear() - 1, ucs, host, apiToken),
            this.getLastYearConsume(bucketName, now, ucs, host, apiToken),
        ]);
        return {
            currentYearMonths,
            lastYearMonths,
            lastYear,
        };
    }
    async lastHour(clientId) {
        const host = process.env.INFLUX_HOST;
        const apiToken = process.env.INFLUX_API_TOKEN;
        const [ucs, settings, bucket, notifications] = await Promise.all([
            this.fetchUcs(clientId),
            this.fetchSettings(clientId),
            this.fetchBucket(clientId),
            this.fetchNotifications(clientId),
        ]);
        if (!bucket) {
            return {
                ucs: [],
                notifications,
                settings,
            };
        }
        const promises = ucs.map(async (uc) => {
            return this.fetchUcsData(uc, settings, bucket, host, apiToken);
        });
        const data = await Promise.all(promises);
        const consume = await this.fetchConsumeData(bucket.name, data, host, apiToken);
        const quality = await this.fetchQuality(data, bucket.name);
        return { ucs: data, notifications, consume, quality, settings };
    }
};
DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [influx_service_1.InfluxService,
        influx_buckets_service_1.InfluxBucketsService,
        ucs_service_1.UcsService,
        setting_service_1.SettingsService,
        last_receiveds_service_1.LastReceivedsService,
        notification_service_1.NotificationService,
        cut_reconnect_service_1.CutReconnectService,
        energy_service_1.EnergyService])
], DashboardService);
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map