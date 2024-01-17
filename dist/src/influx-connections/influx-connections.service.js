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
exports.InfluxConnectionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const removeTrailingSlash_1 = require("../common/utils/removeTrailingSlash");
const influx_connection_entity_1 = require("./entities/influx-connection.entity");
let InfluxConnectionsService = class InfluxConnectionsService {
    constructor(influxConnectionModel) {
        this.influxConnectionModel = influxConnectionModel;
    }
    create(createInfluxConnectionDto) {
        const influxConnection = new this.influxConnectionModel({
            ...createInfluxConnectionDto,
            host: (0, removeTrailingSlash_1.removeTrailingSlash)(createInfluxConnectionDto.host),
        });
        return influxConnection.save();
    }
    findAll() {
        return this.influxConnectionModel.find();
    }
    findOne(id) {
        return this.influxConnectionModel.findById(id);
    }
    update(id, updateInfluxConnectionDto) {
        if (updateInfluxConnectionDto.host) {
            const influxConnection = new this.influxConnectionModel({
                ...updateInfluxConnectionDto,
                host: (0, removeTrailingSlash_1.removeTrailingSlash)(updateInfluxConnectionDto.host),
            });
            return this.influxConnectionModel.findByIdAndUpdate(id, influxConnection);
        }
        return this.influxConnectionModel.findByIdAndUpdate(id, updateInfluxConnectionDto);
    }
    remove(id) {
        return this.influxConnectionModel.deleteOne({ _id: id }).exec();
    }
};
InfluxConnectionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(influx_connection_entity_1.InfluxConnection.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InfluxConnectionsService);
exports.InfluxConnectionsService = InfluxConnectionsService;
//# sourceMappingURL=influx-connections.service.js.map