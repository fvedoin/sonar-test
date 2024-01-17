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
exports.DevicesGbRepository = void 0;
const abstract_repository_1 = require("../common/database/abstract.repository");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const common_1 = require("@nestjs/common");
const devices_gb_entity_1 = require("./entities/devices-gb.entity");
const alert_repository_1 = require("../alert/alert.repository");
const meter_change_repository_1 = require("../meter-change/meter-change.repository");
const cut_reconnect_repository_1 = require("../cut-reconnect/cut-reconnect.repository");
const last_receiveds_repository_1 = require("../last-receiveds/last-receiveds.repository");
const influx_connections_repository_1 = require("../influx-connections/influx-connections.repository");
const influx_buckets_repository_1 = require("../influx-buckets/influx-buckets.repository");
const offline_alert_job_repository_1 = require("../offline-alert-job/offline-alert-job.repository");
const job_repository_1 = require("../online-alert-job/job.repository");
const job_repository_2 = require("../job/job.repository");
const ucs_repository_1 = require("../ucs/ucs.repository");
let DevicesGbRepository = class DevicesGbRepository extends abstract_repository_1.AbstractRepository {
    constructor(deviceGbModel, alertRepository, meterChangeRepository, cutReconnectRepository, lastReceivedRepository, influxConnectionRepository, influxBucketRepository, ucRepository, offlineAlertJobRepository, onlineAlertJobRepository, jobRepository, connection) {
        super(deviceGbModel, connection);
        this.deviceGbModel = deviceGbModel;
        this.alertRepository = alertRepository;
        this.meterChangeRepository = meterChangeRepository;
        this.cutReconnectRepository = cutReconnectRepository;
        this.lastReceivedRepository = lastReceivedRepository;
        this.influxConnectionRepository = influxConnectionRepository;
        this.influxBucketRepository = influxBucketRepository;
        this.ucRepository = ucRepository;
        this.offlineAlertJobRepository = offlineAlertJobRepository;
        this.onlineAlertJobRepository = onlineAlertJobRepository;
        this.jobRepository = jobRepository;
    }
    async migrateDevices({ oldDevice, newDevice, uc, transactionSession, }) {
        try {
            const alerts = await this.alertRepository.findByDeviceId(oldDevice._id);
            for await (const alert of alerts) {
                await this.offlineAlertJobRepository.remove({
                    deviceId: alert.deviceId,
                    alertId: alert._id,
                });
            }
            const alreadyInstalled = await this.lastReceivedRepository.findByDeviceId(newDevice._id);
            if (!alreadyInstalled || alreadyInstalled.length === 0) {
                await this.lastReceivedRepository.updateDeviceId(oldDevice._id, newDevice._id, transactionSession);
            }
            else {
                await this.lastReceivedRepository.deleteMany({ deviceId: oldDevice._id }, transactionSession);
            }
            await this.alertRepository.updateDeviceId(oldDevice._id, newDevice._id, transactionSession);
            await this.meterChangeRepository.updateDeviceId(oldDevice._id, newDevice._id, transactionSession);
            await this.cutReconnectRepository.updateDeviceId(oldDevice._id, newDevice._id, transactionSession);
            await this.jobRepository.updateDeviceId(oldDevice._id, newDevice._id, transactionSession);
            if (uc) {
                await this.ucRepository.updateDeviceId(oldDevice._id, newDevice._id, transactionSession);
            }
            await this.offlineAlertJobRepository.updateDeviceId(oldDevice._id, newDevice._id, transactionSession);
            await this.onlineAlertJobRepository.updateDeviceId(oldDevice._id, newDevice._id, transactionSession);
            return;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async deleteMany(options) {
        await this.deviceGbModel.deleteMany(options);
    }
    async aggregate(pipeline, options) {
        return await this.deviceGbModel.aggregate(pipeline, options);
    }
    async findById(id) {
        return await this.deviceGbModel.findById(id).exec();
    }
    async findByIdPopulate(id, populate) {
        return await this.deviceGbModel.findById(id).populate(populate);
    }
    async findAllJoinByDevId(devId) {
        const device = await this.deviceGbModel
            .aggregate([
            {
                $match: {
                    devId: devId,
                },
            },
            {
                $lookup: {
                    from: 'alerts',
                    localField: '_id',
                    foreignField: 'deviceId',
                    as: 'alerts',
                },
            },
            {
                $unwind: {
                    path: '$alerts',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'ucs',
                    localField: '_id',
                    foreignField: 'deviceId',
                    as: 'uc',
                },
            },
            {
                $unwind: {
                    path: '$uc',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'settings',
                    localField: 'clientId',
                    foreignField: 'clientId',
                    as: 'settings',
                },
            },
            {
                $unwind: {
                    path: '$settings',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    uc: { $first: '$uc' },
                    settings: { $first: '$settings' },
                    devId: { $first: '$devId' },
                    applicationId: { $first: '$applicationId' },
                    alerts: { $push: '$alerts' },
                },
            },
            {
                $project: {
                    _id: 1,
                    applicationId: 1,
                    devId: 1,
                    alerts: {
                        $filter: {
                            input: '$alerts',
                            as: 'a',
                            cond: { $ifNull: ['$$a._id', false] },
                        },
                    },
                    uc: 1,
                    settings: 1,
                },
            },
        ])
            .exec();
        return device;
    }
};
DevicesGbRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(devices_gb_entity_1.DeviceGb.name)),
    __param(11, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        alert_repository_1.AlertRepository,
        meter_change_repository_1.MeterChangeRepository,
        cut_reconnect_repository_1.CutConnectRepository,
        last_receiveds_repository_1.LastReceivedsRepository,
        influx_connections_repository_1.InfluxConnectionRepository,
        influx_buckets_repository_1.InfluxBucketRepository,
        ucs_repository_1.UcsRepository,
        offline_alert_job_repository_1.OfflineAlertJobRepository,
        job_repository_1.OnlineAlertJobRepository,
        job_repository_2.JobRepository,
        mongoose_2.Connection])
], DevicesGbRepository);
exports.DevicesGbRepository = DevicesGbRepository;
//# sourceMappingURL=devices-gb.repository.js.map