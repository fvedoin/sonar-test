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
exports.UcsRepository = void 0;
const abstract_repository_1 = require("../common/database/abstract.repository");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const common_1 = require("@nestjs/common");
const uc_entity_1 = require("./entities/uc.entity");
let UcsRepository = class UcsRepository extends abstract_repository_1.AbstractRepository {
    constructor(ucModel, connection) {
        super(ucModel, connection);
        this.ucModel = ucModel;
    }
    async findWithPopulate(query, projection = {}) {
        return this.ucModel.find(query, projection).populate('deviceId').lean();
    }
    async findWherePopulate(whereClause, populate) {
        return await this.ucModel.find(whereClause).populate(populate);
    }
    async findByIdAndUpdate(id, uc, session) {
        return await this.ucModel.findOneAndUpdate({ _id: id }, uc, { session });
    }
    async findWithOnePopulate(query, projection = {}) {
        return this.ucModel.findOne(query, projection).populate([
            'deviceId',
            'clientId',
            'settings',
            {
                path: 'lastReceived',
                options: { sort: { port: 1 } },
            },
        ]);
    }
    async findByIdWithPopulate(filterQuery, populate) {
        return this.ucModel.findById(filterQuery).populate(populate);
    }
    async findAndPopulate(filterQuery, populate) {
        return this.ucModel.find(filterQuery).populate(populate);
    }
    async countByDeviceId(deviceId) {
        return this.ucModel.count({ deviceId });
    }
    async countByUcByDeviceId(deviceId, id) {
        return this.ucModel.count({ deviceId: deviceId, _id: { $ne: id } });
    }
    async deleteMany(ids) {
        await this.ucModel.deleteMany({ _id: { $in: ids } });
    }
    async updateDeviceId(oldDeviceId, newDeviceId, session) {
        return await this.ucModel.updateMany({ deviceId: oldDeviceId }, { deviceId: newDeviceId }, { session });
    }
    async findPaginated(where, data) {
        const ucs = await this.ucModel.aggregate([
            {
                $lookup: {
                    from: 'clients',
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'clientId',
                },
            },
            {
                $unwind: {
                    path: '$clientId',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'devices',
                    localField: 'deviceId',
                    foreignField: '_id',
                    as: 'deviceId',
                },
            },
            {
                $unwind: {
                    path: '$deviceId',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'transformers',
                    localField: 'transformerId',
                    foreignField: '_id',
                    as: 'transformerId',
                },
            },
            {
                $unwind: {
                    path: '$transformerId',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'lastreceiveds',
                    localField: 'deviceId._id',
                    foreignField: 'deviceId',
                    as: 'lastReceived',
                },
            },
            {
                $lookup: {
                    from: 'settings',
                    localField: 'clientId._id',
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
                $unwind: {
                    path: '$lastReceived',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    transformerId: {
                        $first: '$transformerId',
                    },
                    deviceId: {
                        $first: '$deviceId',
                    },
                    clientId: {
                        $first: '$clientId',
                    },
                    settings: {
                        $first: '$settings',
                    },
                    lastReceived: {
                        $push: '$lastReceived',
                    },
                    routeCode: {
                        $first: '$routeCode',
                    },
                    ucCode: {
                        $first: '$ucCode',
                    },
                    ucNumber: {
                        $first: '$ucNumber',
                    },
                    ucClass: {
                        $first: '$ucClass',
                    },
                    subClass: {
                        $first: '$subClass',
                    },
                    billingGroup: {
                        $first: '$billingGroup',
                    },
                    group: {
                        $first: '$group',
                    },
                    ratedVoltage: {
                        $first: '$ratedVoltage',
                    },
                    subGroup: {
                        $first: '$subGroup',
                    },
                    sequence: {
                        $first: '$sequence',
                    },
                    phases: {
                        $first: '$phases',
                    },
                    isCutted: {
                        $first: '$isCutted',
                    },
                    circuitBreaker: {
                        $first: '$circuitBreaker',
                    },
                    microgeneration: {
                        $first: '$microgeneration',
                    },
                    district: {
                        $first: '$district',
                    },
                    timeZone: {
                        $first: '$timeZone',
                    },
                    city: {
                        $first: '$city',
                    },
                    location: {
                        $first: '$location',
                    },
                },
            },
            {
                $match: where,
            },
            {
                $facet: {
                    data,
                    pageInfo: [
                        {
                            $group: {
                                _id: null,
                                count: {
                                    $sum: 1,
                                },
                            },
                        },
                    ],
                },
            },
        ]);
        return {
            data: ucs[0].data,
            pageInfo: ucs[0].pageInfo[0],
        };
    }
};
UcsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(uc_entity_1.Uc.name)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Connection])
], UcsRepository);
exports.UcsRepository = UcsRepository;
//# sourceMappingURL=ucs.repository.js.map