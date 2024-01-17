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
exports.TransformersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const Role_1 = require("../auth/models/Role");
const clients_service_1 = require("../clients/clients.service");
const find_transformers_dto_1 = require("./dto/find-transformers.dto");
const process_file_dto_1 = require("./dto/process-file.dto");
const update_transformer_dto_1 = require("./dto/update-transformer.dto");
const transformers_service_1 = require("./transformers.service");
const users_service_1 = require("../users/users.service");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils/utils");
const filterHandler_1 = require("../utils/filterHandler");
const utmObj = require('utm-latlng');
const utm = new utmObj();
let TransformersController = class TransformersController {
    constructor(transformersService, clientsService, usersService) {
        this.transformersService = transformersService;
        this.clientsService = clientsService;
        this.usersService = usersService;
    }
    async postMany(data) {
        for await (const item of data) {
            this.transformersService.updateOrInsert(item);
        }
    }
    async processTxt({ clientId }, file, user) {
        const response = [];
        let aux = 0;
        let client;
        if (user.accessLevel !== Role_1.Role.SUPER_ADMIN &&
            user.accessLevel !== Role_1.Role.ADMIN &&
            user.accessLevel !== Role_1.Role.SUPPORT) {
            client = clientId;
        }
        else {
            client = user.clientId;
        }
        const csvData = file.buffer.toString();
        const parsedData = csvData.split('\n').slice(1);
        for await (let line of parsedData) {
            if (aux !== 0 && line.length !== 0) {
                line = line.replace('\r', '');
                const parsedLine = line.split(';');
                const transformer = await this.transformersService.findByIt(parsedLine[0]);
                const fuso = parsedLine[9].split(/([0-9]+)/);
                const coordinates = await utm.convertUtmToLatLng(Number(parsedLine[6].replace(',', '.')), Number(parsedLine[7].replace(',', '.')), fuso[1], fuso[2]);
                const location = {
                    type: 'Point',
                    coordinates: [coordinates.lng, coordinates.lat],
                };
                if (transformer == null) {
                    response.push({
                        clientId: client,
                        it: parsedLine[0],
                        serieNumber: parsedLine[1],
                        tapLevel: Number(parsedLine[2]),
                        tap: Number(parsedLine[3].replace(',', '.')),
                        feeder: parsedLine[4],
                        city: parsedLine[5],
                        location: location,
                        operation: 'Inserir',
                    });
                }
                else {
                    response.push({
                        id: transformer._id,
                        clientId: client,
                        it: parsedLine[0],
                        serieNumber: parsedLine[1],
                        tapLevel: Number(parsedLine[2]),
                        tap: Number(parsedLine[3].replace(',', '.')),
                        feeder: parsedLine[4],
                        city: parsedLine[5],
                        location: location,
                        operation: 'Editar',
                    });
                }
            }
            aux++;
        }
        return response;
    }
    async findAll(query, user) {
        try {
            const { clientId, sort, skip, limit, searchText, filter = [], fieldMask, } = query;
            const convertedSort = sort ? (0, utils_1.convertPropertiesToInt)(sort) : { it: 1 };
            const convertedFieldMask = fieldMask
                ? (0, utils_1.convertPropertiesToInt)(fieldMask)
                : null;
            const handledFilters = (0, filterHandler_1.handleFilters)(filter);
            if (clientId) {
                handledFilters.push({
                    'clientId._id': new mongoose_1.default.Types.ObjectId(clientId),
                });
            }
            const edges = [{ $sort: convertedSort }];
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
            };
            const currentUser = user;
            if (currentUser.accessLevel === Role_1.Role.SUPER_ADMIN ||
                currentUser.accessLevel === Role_1.Role.SUPPORT) {
                return await this.transformersService.findAllPopulate(searchOpts);
            }
            if (currentUser.accessLevel === Role_1.Role.ADMIN) {
                searchOpts.filter.push({
                    $or: [
                        {
                            'clientId._id': new mongoose_1.default.Types.ObjectId(user.clientId),
                        },
                        {
                            'clientId.parentId': new mongoose_1.default.Types.ObjectId(user.clientId),
                        },
                    ],
                });
                return await this.transformersService.findAllPopulate(searchOpts);
            }
            searchOpts.filter.push({
                'clientId._id': new mongoose_1.default.Types.ObjectId(user.clientId),
            });
            return await this.transformersService.findAllPopulate(searchOpts);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Erro ao buscar transformadores.',
                stacktrace: error.message,
            }, common_1.HttpStatus.BAD_REQUEST, {
                cause: error,
            });
        }
    }
    async filterTransformersDevice(clientId) {
        return await this.transformersService.filterTransformersDevice(clientId);
    }
    findOne(id) {
        return this.transformersService.findOne(id);
    }
    update(id, updateTransformerDto, user) {
        if (user.accessLevel !== Role_1.Role.SUPER_ADMIN &&
            user.accessLevel !== Role_1.Role.ADMIN &&
            user.accessLevel !== Role_1.Role.SUPPORT) {
            updateTransformerDto.clientId = user.clientId;
        }
        return this.transformersService.update(id, updateTransformerDto);
    }
    remove(ids) {
        return this.transformersService.remove(ids.split(','));
    }
};
__decorate([
    (0, common_1.Post)('many'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], TransformersController.prototype, "postMany", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                clientId: {
                    type: 'string',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [process_file_dto_1.ProcessFileDto, Object, Object]),
    __metadata("design:returntype", Promise)
], TransformersController.prototype, "processTxt", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN, Role_1.Role.ADMIN, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.VIEWER),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_transformers_dto_1.FindTransformersDto, Object]),
    __metadata("design:returntype", Promise)
], TransformersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('devices'),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN, Role_1.Role.ADMIN, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.VIEWER),
    __param(0, (0, common_1.Query)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransformersController.prototype, "filterTransformersDevice", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN, Role_1.Role.ADMIN, Role_1.Role.SUPPORT, Role_1.Role.MANAGER, Role_1.Role.VIEWER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransformersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_transformer_dto_1.UpdateTransformerDto, Object]),
    __metadata("design:returntype", void 0)
], TransformersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':ids'),
    __param(0, (0, common_1.Param)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransformersController.prototype, "remove", null);
TransformersController = __decorate([
    (0, swagger_1.ApiTags)('Transformadores'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN, Role_1.Role.ADMIN, Role_1.Role.MANAGER),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('transformers'),
    __metadata("design:paramtypes", [transformers_service_1.TransformersService,
        clients_service_1.ClientsService,
        users_service_1.UsersService])
], TransformersController);
exports.TransformersController = TransformersController;
//# sourceMappingURL=transformers.controller.js.map