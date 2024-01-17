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
exports.UcdisabledHistoryService = void 0;
const common_1 = require("@nestjs/common");
const ucdisabled_history_repository_1 = require("./ucdisabled-history.repository");
const utils_1 = require("../utils/utils");
const filterHandler_1 = require("../utils/filterHandler");
const fields = ['clientId', 'devId', 'ucCode', 'dataDeleted', 'user'];
let UcdisabledHistoryService = class UcdisabledHistoryService {
    constructor(ucdisabledHistoryRepository) {
        this.ucdisabledHistoryRepository = ucdisabledHistoryRepository;
    }
    async create(createUcdisabledHistoryDto, session) {
        const createdUcDisabledHistory = await this.ucdisabledHistoryRepository.create({
            ...createUcdisabledHistoryDto,
        }, { session });
        return createdUcDisabledHistory;
    }
    findAll(query) {
        const { sort, skip, limit, searchText, filter = [], fieldMask } = query;
        const convertedSort = sort ? (0, utils_1.convertPropertiesToInt)(sort) : { it: 1 };
        const convertedFieldMask = fieldMask
            ? (0, utils_1.convertPropertiesToInt)(fieldMask)
            : null;
        const convertedFilter = (0, utils_1.convertPropertiesToBoolean)(filter);
        const edges = [{ $sort: convertedSort }];
        const handledFilters = (0, filterHandler_1.handleFilters)(convertedFilter, 'date');
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
        return this.findAllPopulate(searchOpts);
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
            { $match: generalWhereClause },
            { $unwind: { path: '$clientId', preserveNullAndEmptyArrays: true } },
        ];
        aggregatePipeline.push({
            $group: {
                _id: '$_id',
                clientId: { $first: '$clientId' },
                ucCode: { $first: '$ucCode' },
                devId: { $first: '$devId' },
                dataDeleted: { $first: '$dataDeleted' },
                user: { $first: '$user' },
                date: { $first: '$date' },
            },
        }, {
            $project: fieldMask || {
                _id: 1,
                ucCode: 1,
                devId: 1,
                dataDeleted: 1,
                user: 1,
                date: 1,
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
        const result = await this.ucdisabledHistoryRepository.aggregate(aggregatePipeline);
        return {
            data: result[0].edges,
            pageInfo: result[0].pageInfo[0],
        };
    }
};
UcdisabledHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ucdisabled_history_repository_1.UcdisabledHistoryRepository])
], UcdisabledHistoryService);
exports.UcdisabledHistoryService = UcdisabledHistoryService;
//# sourceMappingURL=ucdisabled-history.service.js.map