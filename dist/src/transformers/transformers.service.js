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
exports.TransformersService = void 0;
const common_1 = require("@nestjs/common");
const transformers_repository_1 = require("./transformers.repository");
const mongoose_1 = require("mongoose");
const ObjectId = mongoose_1.default.Types.ObjectId;
const fields = [
    'it',
    'remote',
    'serieNumber',
    'tapLevel',
    'tap',
    'feeder',
    'city',
    'location',
    'clientId.name',
    'smartTrafoDeviceId.devId',
    'secondaryDeviceId.devId',
];
let TransformersService = class TransformersService {
    constructor(transformerRepository) {
        this.transformerRepository = transformerRepository;
    }
    async updateOrInsert(transformer) {
        try {
            const filterQuery = { it: transformer.it };
            const updatedTransformer = await this.transformerRepository.upsert(filterQuery, transformer);
            return updatedTransformer;
        }
        catch (error) {
            return error;
        }
    }
    async findWhereAndPopulate(where, populate) {
        return await this.transformerRepository.findWhereAndPopulate(where, populate);
    }
    async findAllPopulate({ edges, searchText, filter, fieldMask }) {
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
        const generalFilters = filter;
        if (generalFilters.length > 0) {
            if (generalWhereClause.$and) {
                generalWhereClause.$and.push({
                    $and: generalFilters,
                });
            }
            else {
                generalWhereClause.$and = [{ $and: generalFilters }];
            }
        }
        const transformers = await this.transformerRepository.aggregate([
            {
                $lookup: {
                    from: 'smarttrafodevices',
                    localField: 'smartTrafoDeviceId',
                    foreignField: '_id',
                    as: 'smartTrafoDeviceId',
                },
            },
            {
                $unwind: {
                    path: '$smartTrafoDeviceId',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'smarttrafodevices',
                    localField: 'secondaryDeviceId',
                    foreignField: '_id',
                    as: 'secondaryDeviceId',
                },
            },
            {
                $unwind: {
                    path: '$secondaryDeviceId',
                    preserveNullAndEmptyArrays: true,
                },
            },
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
                $match: generalWhereClause,
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
                $lookup: {
                    from: 'lastreceivedssmarttrafos',
                    localField: 'smartTrafoDeviceId._id',
                    foreignField: 'deviceId',
                    as: 'lastReceived',
                },
            },
            {
                $unwind: {
                    path: '$lastReceived',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'lastreceivedssmarttrafos',
                    localField: 'secondaryDeviceId._id',
                    foreignField: 'deviceId',
                    as: 'lastReceivedSecondary',
                },
            },
            {
                $unwind: {
                    path: '$lastReceivedSecondary',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'brokerattributes',
                    localField: 'smartTrafoDeviceId.devId',
                    foreignField: 'devId',
                    pipeline: [
                        {
                            $match: {
                                devId: { $exists: true, $ne: null },
                            },
                        },
                    ],
                    as: 'mqttAccess',
                },
            },
            {
                $unwind: {
                    path: '$mqttAccess',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    smartTrafoDeviceId: { $first: '$smartTrafoDeviceId' },
                    secondaryDeviceId: { $first: '$secondaryDeviceId' },
                    clientId: { $first: '$clientId' },
                    settings: { $first: '$settings' },
                    lastReceived: { $push: '$lastReceived' },
                    lastReceivedSecondary: { $push: '$lastReceivedSecondary' },
                    it: { $first: '$it' },
                    remote: { $first: '$remote' },
                    serieNumber: { $first: '$serieNumber' },
                    tapLevel: { $first: '$tapLevel' },
                    tap: { $first: '$tap' },
                    feeder: { $first: '$feeder' },
                    city: { $first: '$city' },
                    location: { $first: '$location' },
                    mqttAccess: { $first: '$mqttAccess' },
                },
            },
            {
                $project: fieldMask || {
                    _id: 1,
                    lastReceived: 1,
                    lastReceivedSecondary: 1,
                    smartTrafoDeviceId: 1,
                    secondaryDeviceId: 1,
                    clientId: 1,
                    settings: 1,
                    it: 1,
                    remote: 1,
                    serieNumber: 1,
                    tapLevel: 1,
                    tap: 1,
                    feeder: 1,
                    city: 1,
                    location: 1,
                    mqttAccess: 1,
                },
            },
            {
                $facet: {
                    edges,
                    pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
                },
            },
        ]);
        return {
            data: transformers[0].edges,
            pageInfo: transformers[0].pageInfo[0],
        };
    }
    find(where) {
        return this.transformerRepository.find(where);
    }
    async filterTransformersDevice(clientId) {
        const transformers = await this.transformerRepository.aggregate([
            {
                $lookup: {
                    from: 'smarttrafodevices',
                    localField: 'smartTrafoDeviceId',
                    foreignField: '_id',
                    as: 'smartTrafoDeviceId',
                },
            },
            {
                $unwind: {
                    path: '$smartTrafoDeviceId',
                },
            },
            {
                $lookup: {
                    from: 'smarttrafodevices',
                    localField: 'secondaryDeviceId',
                    foreignField: '_id',
                    as: 'secondaryDeviceId',
                },
            },
            {
                $unwind: {
                    path: '$secondaryDeviceId',
                    preserveNullAndEmptyArrays: true,
                },
            },
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
                $match: {
                    'clientId._id': new ObjectId(clientId),
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
                $lookup: {
                    from: 'lastreceivedssmarttrafos',
                    localField: 'smartTrafoDeviceId._id',
                    foreignField: 'deviceId',
                    as: 'lastReceived',
                },
            },
            {
                $unwind: {
                    path: '$lastReceived',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'lastreceivedssmarttrafos',
                    localField: 'secondaryDeviceId._id',
                    foreignField: 'deviceId',
                    as: 'lastReceivedSecondary',
                },
            },
            {
                $unwind: {
                    path: '$lastReceivedSecondary',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'brokerattributes',
                    localField: 'smartTrafoDeviceId.devId',
                    foreignField: 'devId',
                    pipeline: [
                        {
                            $match: {
                                devId: { $exists: true, $ne: null },
                            },
                        },
                    ],
                    as: 'mqttAccess',
                },
            },
            {
                $unwind: {
                    path: '$mqttAccess',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    smartTrafoDeviceId: { $first: '$smartTrafoDeviceId' },
                    secondaryDeviceId: { $first: '$secondaryDeviceId' },
                    clientId: { $first: '$clientId' },
                    settings: { $first: '$settings' },
                    lastReceived: { $push: '$lastReceived' },
                    lastReceivedSecondary: {
                        $push: '$lastReceivedSecondary',
                    },
                    it: { $first: '$it' },
                    remote: { $first: '$remote' },
                    serieNumber: { $first: '$serieNumber' },
                    tapLevel: { $first: '$tapLevel' },
                    tap: { $first: '$tap' },
                    feeder: { $first: '$feeder' },
                    city: { $first: '$city' },
                    location: { $first: '$location' },
                    mqttAccess: { $first: '$mqttAccess' },
                },
            },
            {
                $group: {
                    _id: null,
                    data: { $push: '$$ROOT' },
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);
        if (!transformers || !transformers?.length) {
            return {
                data: [],
                pageInfo: {
                    count: 0,
                },
            };
        }
        return {
            data: transformers[0].data,
            pageInfo: {
                count: transformers[0].count,
            },
        };
    }
    findOne(id) {
        return this.transformerRepository.findOne({ _id: id });
    }
    findByIt(it) {
        return this.transformerRepository.findOne({ it: it });
    }
    update(id, updateTransformerDto) {
        return this.transformerRepository.findOneAndUpdate({ _id: id }, {
            ...updateTransformerDto,
            $unset: {
                smartTrafoDeviceId: updateTransformerDto.smartTrafoDeviceId ? 0 : 1,
                secondaryDeviceId: updateTransformerDto.secondaryDeviceId ? 0 : 1,
            },
        });
    }
    remove(ids) {
        return this.transformerRepository.deleteMany({ _id: { $in: ids } });
    }
};
TransformersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transformers_repository_1.TransformersRepository])
], TransformersService);
exports.TransformersService = TransformersService;
//# sourceMappingURL=transformers.service.js.map