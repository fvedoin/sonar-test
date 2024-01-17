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
exports.InfluxBucketsService = void 0;
const influxdb_client_1 = require("@influxdata/influxdb-client");
const influxdb_client_apis_1 = require("@influxdata/influxdb-client-apis");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose = require("mongoose");
const influx_connections_service_1 = require("../influx-connections/influx-connections.service");
const influx_bucket_entity_1 = require("./entities/influx-bucket.entity");
let InfluxBucketsService = class InfluxBucketsService {
    constructor(influxBucketModel, connection, influxConnectionsService) {
        this.influxBucketModel = influxBucketModel;
        this.connection = connection;
        this.influxConnectionsService = influxConnectionsService;
    }
    async create(createInfluxBucketDto) {
        const influxConnection = await this.influxConnectionsService.findOne(createInfluxBucketDto.influxConnectionId);
        const transactionSession = await this.connection.startSession();
        transactionSession.startTransaction();
        const influxBucket = new this.influxBucketModel(createInfluxBucketDto);
        await influxBucket.save({ session: transactionSession });
        const influxDB = new influxdb_client_1.InfluxDB({
            url: influxConnection.host,
            token: influxConnection.apiToken,
        });
        const bucketsAPI = new influxdb_client_apis_1.BucketsAPI(influxDB);
        await bucketsAPI.postBuckets({
            body: {
                orgID: influxConnection.orgId,
                name: createInfluxBucketDto.name,
            },
        });
        await transactionSession.commitTransaction();
        transactionSession.endSession();
        return influxBucket;
    }
    findOne(id, populate, projection) {
        return this.influxBucketModel.findById(id, projection).populate(populate);
    }
    findOneWhere(where) {
        return this.influxBucketModel.findOne(where);
    }
    findByInfluxConnection(id) {
        return this.influxBucketModel.find({ influxConnectionId: id });
    }
    update(id, updateInfluxBucketDto) {
        return this.influxBucketModel.findByIdAndUpdate(id, updateInfluxBucketDto);
    }
    remove(id) {
        return this.influxBucketModel.deleteOne({ _id: id }).exec();
    }
};
InfluxBucketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(influx_bucket_entity_1.InfluxBucket.name)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model, mongoose.Connection, influx_connections_service_1.InfluxConnectionsService])
], InfluxBucketsService);
exports.InfluxBucketsService = InfluxBucketsService;
//# sourceMappingURL=influx-buckets.service.js.map