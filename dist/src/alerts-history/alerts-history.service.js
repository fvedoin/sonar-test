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
exports.AlertsHistoryService = void 0;
const common_1 = require("@nestjs/common");
const alerts_history_repository_1 = require("./alerts-history.repository");
const filterHandler_1 = require("../utils/filterHandler");
const utils_1 = require("../utils/utils");
const mongoose_1 = require("mongoose");
const fields = [
    'clientId.name',
    'alertType',
    'alertName',
    'alertAllows',
    'alertVariables',
    'alertValue',
    'operator',
    'sentEmail',
    'alertTime',
];
let AlertsHistoryService = class AlertsHistoryService {
    constructor(alertsHistoryRepository) {
        this.alertsHistoryRepository = alertsHistoryRepository;
    }
    async findAll(query, user) {
        const { clientId, sort, skip, limit, searchText, filter = [], fieldMask, } = query;
        const convertedSort = sort ? (0, utils_1.convertPropertiesToInt)(sort) : { it: 1 };
        const convertedFieldMask = fieldMask
            ? (0, utils_1.convertPropertiesToInt)(fieldMask)
            : null;
        const convertedFilter = (0, utils_1.convertPropertiesToBoolean)(filter);
        const edges = [{ $sort: convertedSort }];
        const handledFilters = (0, filterHandler_1.handleFilters)(convertedFilter, 'alertTime');
        if (skip) {
            edges.push({ $skip: Number(skip) });
        }
        if (limit) {
            edges.push({ $limit: Number(limit) });
        }
        const searchOpts = {
            edges,
            searchText,
            filter: handledFilters,
            fieldMask: convertedFieldMask,
            match: {},
        };
        if (clientId) {
            searchOpts.filter.push({
                'clientId._id': new mongoose_1.default.Types.ObjectId(clientId),
            });
            return this.findAllPopulate(searchOpts);
        }
        if (user.accessLevel === 'admin' || user.accessLevel === 'support') {
            return this.findAllPopulate(searchOpts);
        }
        if (user.clientId) {
            handledFilters.push({
                'clientId._id': new mongoose_1.default.Types.ObjectId(user.clientId),
            });
            return this.findAllPopulate(searchOpts);
        }
    }
    buildGeneralWhereClause(searchText, filter) {
        const generalWhereClause = {};
        if (searchText) {
            generalWhereClause.$and = [
                {
                    $or: [
                        ...fields.map((item) => {
                            return { [item]: { $regex: searchText, $options: 'i' } };
                        }),
                    ],
                },
            ];
        }
        const generalFilters = filter || [];
        if (generalFilters.length > 0) {
            if (generalWhereClause.$and) {
                generalWhereClause.$and.push({
                    $and: generalFilters,
                });
            }
            else {
                generalWhereClause.$and = [{ $and: filter }];
            }
        }
        return generalWhereClause;
    }
    buildAggregatePipeline(generalWhereClause, fieldMask, edges) {
        const aggregatePipeline = [
            {
                $lookup: {
                    from: 'clients',
                    localField: 'clientId',
                    foreignField: '_id',
                    as: 'clientId',
                },
            },
            { $match: generalWhereClause },
            { $unwind: { path: '$clientId', preserveNullAndEmptyArrays: true } },
        ];
        aggregatePipeline.push({
            $group: {
                _id: '$_id',
                alertType: { $first: '$alertType' },
                alertAllows: { $first: '$alertAllows' },
                alertName: { $first: '$alertName' },
                alertVariables: { $first: '$alertVariables' },
                alertValue: { $first: '$alertValue' },
                operator: { $first: '$operator' },
                sentEmail: { $first: '$sentEmail' },
                alertTime: { $first: '$alertTime' },
                clientId: { $first: '$clientId' },
            },
        }, {
            $project: fieldMask || {
                _id: 1,
                alertType: 1,
                alertName: 1,
                alertAllows: 1,
                alertVariables: 1,
                alertValue: 1,
                operator: 1,
                sentEmail: 1,
                alertTime: 1,
                clientId: 1,
            },
        }, {
            $facet: {
                edges,
                pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
            },
        });
        return aggregatePipeline;
    }
    async findAllPopulate({ edges, searchText, filter, fieldMask }) {
        const generalWhereClause = this.buildGeneralWhereClause(searchText, filter);
        const aggregatePipeline = this.buildAggregatePipeline(generalWhereClause, fieldMask, edges);
        const result = await this.alertsHistoryRepository.aggregate(aggregatePipeline);
        return {
            data: result[0].edges,
            pageInfo: result[0].pageInfo[0],
        };
    }
};
AlertsHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [alerts_history_repository_1.AlertsHistoryRepository])
], AlertsHistoryService);
exports.AlertsHistoryService = AlertsHistoryService;
//# sourceMappingURL=alerts-history.service.js.map