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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const constants_1 = require("../common/constants");
const settingsCreated_event_1 = require("./events/settingsCreated.event");
const settingsUpdated_event_1 = require("./events/settingsUpdated.event");
const setting_repository_1 = require("./setting.repository");
const mongoose_1 = require("mongoose");
const filterHandler_1 = require("../utils/filterHandler");
const utils_1 = require("../utils/utils");
const fields = [
    'clientId',
    'offlineTime',
    'peakHourStart',
    'peakHourEnd',
    'precariousVoltageAbove',
    'precariousVoltageBelow',
    'criticalVoltageAbove',
    'criticalVoltageBelow',
];
let SettingsService = class SettingsService {
    constructor(settingRepository, eventEmitter) {
        this.settingRepository = settingRepository;
        this.eventEmitter = eventEmitter;
    }
    getDefaultSettings() {
        return {
            offlineTime: 60,
            peakHourStart: 18,
            peakHourEnd: 21,
            precariousVoltageAbove: '231,233',
            precariousVoltageBelow: '191,202',
            criticalVoltageAbove: '233,250',
            criticalVoltageBelow: '0,191',
        };
    }
    sanitizeValue(dto) {
        const setting = {
            ...dto,
            precariousVoltageAbove: dto.precariousVoltageAbove.replaceAll(' ', ''),
            precariousVoltageBelow: dto.precariousVoltageBelow.replaceAll(' ', ''),
            criticalVoltageAbove: dto.criticalVoltageAbove.replaceAll(' ', ''),
            criticalVoltageBelow: dto.criticalVoltageBelow.replaceAll(' ', ''),
        };
        return setting;
    }
    async create(createSettingDto) {
        const settings = this.sanitizeValue(createSettingDto);
        const clientId = createSettingDto.clientId.toString();
        const settingsCreated = await this.settingRepository.create(settings);
        this.eventEmitter.emit(constants_1.SETTINGS_CREATED, new settingsCreated_event_1.SettingsCreatedEvent(clientId));
        return settingsCreated;
    }
    findAll(query, user) {
        const { clientId, sort, skip, limit, searchText, filter = [], fieldMask, } = query;
        const convertedSort = sort
            ? (0, utils_1.convertPropertiesToInt)(sort)
            : { offlineTime: 1 };
        const convertedFieldMask = fieldMask
            ? (0, utils_1.convertPropertiesToInt)(fieldMask)
            : null;
        const convertedFilter = (0, utils_1.convertArrayStringsToInt)(filter);
        const edges = [{ $sort: convertedSort }];
        const handledFilters = (0, filterHandler_1.handleFilters)(convertedFilter);
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
        else {
            if (user.accessLevel === 'admin') {
                return this.findAllPopulate(searchOpts);
            }
            else {
                if (user.clientId) {
                    handledFilters.push({
                        'clientId._id': new mongoose_1.default.Types.ObjectId(user.clientId),
                    });
                    return this.findAllPopulate(searchOpts);
                }
            }
        }
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
                clientId: { $first: '$clientId' },
                offlineTime: { $first: '$offlineTime' },
                peakHourStart: { $first: '$peakHourStart' },
                peakHourEnd: { $first: '$peakHourEnd' },
                precariousVoltageAbove: { $first: '$precariousVoltageAbove' },
                precariousVoltageBelow: { $first: '$precariousVoltageBelow' },
                criticalVoltageAbove: { $first: '$criticalVoltageAbove' },
                criticalVoltageBelow: { $first: '$criticalVoltageBelow' },
            },
        }, {
            $project: fieldMask || {
                _id: 1,
                offlineTime: 1,
                peakHourStart: 1,
                peakHourEnd: 1,
                precariousVoltageAbove: 1,
                precariousVoltageBelow: 1,
                criticalVoltageAbove: 1,
                criticalVoltageBelow: 1,
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
        const result = await this.settingRepository.aggregate(aggregatePipeline);
        return {
            data: result[0].edges,
            pageInfo: result[0].pageInfo[0],
        };
    }
    async parseVoltageRange(voltage) {
        const [low, high] = voltage.split(',');
        return {
            low: parseFloat(low),
            high: parseFloat(high),
        };
    }
    async findCriticalAndPrecariousVoltages(user, clientId) {
        let filteredClientId = clientId;
        if (user.accessLevel === 'orgadmin' || user.accessLevel === 'admin') {
            filteredClientId = clientId;
        }
        else {
            filteredClientId = user.clientId;
        }
        const settings = await this.settingRepository.findOne({ clientId: filteredClientId }, {
            precariousVoltageAbove: 1,
            precariousVoltageBelow: 1,
            criticalVoltageAbove: 1,
            criticalVoltageBelow: 1,
        });
        const formattedSettings = {
            precariousVoltageAbove: await this.parseVoltageRange(settings.precariousVoltageAbove),
            precariousVoltageBelow: await this.parseVoltageRange(settings.precariousVoltageBelow),
            criticalVoltageAbove: await this.parseVoltageRange(settings.criticalVoltageAbove),
            criticalVoltageBelow: await this.parseVoltageRange(settings.criticalVoltageBelow),
        };
        return formattedSettings;
    }
    find(query, projection) {
        return this.settingRepository.findOne(query, projection);
    }
    async update(id, updateSettingDto) {
        const settings = this.sanitizeValue(updateSettingDto);
        const clientId = updateSettingDto.clientId.toString();
        const settingsUpdated = await this.settingRepository.findOneAndUpdate({ _id: id }, { $set: settings });
        this.eventEmitter.emit(constants_1.SETTINGS_UPDATED, new settingsUpdated_event_1.SettingsUpdatedEvent(clientId));
        return settingsUpdated;
    }
    async remove(id) {
        await this.settingRepository.deleteMany({ _id: { $in: id } });
    }
};
SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [setting_repository_1.SettingsRepository,
        event_emitter_1.EventEmitter2])
], SettingsService);
exports.SettingsService = SettingsService;
//# sourceMappingURL=setting.service.js.map