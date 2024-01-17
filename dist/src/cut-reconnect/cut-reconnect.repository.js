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
exports.CutConnectRepository = void 0;
const abstract_repository_1 = require("../common/database/abstract.repository");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const common_1 = require("@nestjs/common");
const cut_reconnect_entity_1 = require("./entities/cut-reconnect.entity");
let CutConnectRepository = class CutConnectRepository extends abstract_repository_1.AbstractRepository {
    constructor(cutReconnect, connection) {
        super(cutReconnect, connection);
        this.cutReconnect = cutReconnect;
    }
    async findWhere(whereClause) {
        return this.cutReconnect
            .aggregate([
            {
                $match: whereClause,
            },
            {
                $lookup: {
                    from: 'ucs',
                    localField: 'deviceId',
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
                $group: {
                    _id: '$_id',
                    createdAt: { $first: '$createdAt' },
                    deviceId: { $first: '$deviceId' },
                    status: { $first: '$status' },
                    tech: { $first: '$tech' },
                    type: { $first: '$type' },
                    updatedAt: { $first: '$updatedAt' },
                    userId: { $first: '$userId' },
                    uc: { $first: '$uc' },
                },
            },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    type: 1,
                    tech: 1,
                    status: 1,
                    deviceId: 1,
                    userId: 1,
                    uc: 1,
                },
            },
        ])
            .exec();
    }
    async updateDeviceId(oldDeviceId, newDeviceId, session) {
        return await this.cutReconnect.updateMany({ deviceId: oldDeviceId }, { deviceId: newDeviceId }, { session });
    }
};
CutConnectRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cut_reconnect_entity_1.CutReconnect.name)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Connection])
], CutConnectRepository);
exports.CutConnectRepository = CutConnectRepository;
//# sourceMappingURL=cut-reconnect.repository.js.map