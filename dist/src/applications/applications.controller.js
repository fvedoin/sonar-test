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
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose = require("mongoose");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const Role_1 = require("../auth/models/Role");
const ttn_service_1 = require("../common/services/ttn.service");
const applications_service_1 = require("./applications.service");
const create_application_dto_1 = require("./dto/create-application.dto");
const update_application_dto_1 = require("./dto/update-application.dto");
let ApplicationsController = class ApplicationsController {
    constructor(connection, applicationsService) {
        this.connection = connection;
        this.applicationsService = applicationsService;
    }
    async create(createApplicationDto) {
        const { appId, name, description } = createApplicationDto;
        const transactionSession = await this.connection.startSession();
        transactionSession.startTransaction();
        const token = Buffer.from(appId + ':' + name).toString('hex');
        const ttnApplication = await ttn_service_1.TtnService.get(`/users/${process.env.TTN_USER}/applications`);
        const foundIndex = ttnApplication.data.applications.findIndex((item) => item.ids.application_id === appId);
        const createdApplication = this.applicationsService.create(createApplicationDto, token, transactionSession);
        if (foundIndex < 0) {
            await ttn_service_1.TtnService.post(`/users/${process.env.TTN_USER}/applications`, {
                application: {
                    name,
                    description,
                    ids: {
                        application_id: appId,
                    },
                },
            });
        }
        else {
            await ttn_service_1.TtnService.put(`/applications/${appId}`, {
                application: {
                    name,
                    description,
                },
                field_mask: {
                    paths: ['description', 'name'],
                },
            });
        }
        await transactionSession.commitTransaction();
        transactionSession.endSession();
        return createdApplication;
    }
    async findAll(clientId) {
        let applications;
        const parsedData = { synchronized: [], unsynchronized: [] };
        if (clientId) {
            applications = await this.applicationsService.findWhere(clientId);
            parsedData.synchronized = applications;
        }
        else {
            applications = await this.applicationsService.findAll();
            const ttnResponse = await ttn_service_1.TtnService.get('applications?field_mask=name,description');
            const ttnApplications = ttnResponse.data.applications;
            ttnApplications.map((item) => {
                const index = applications.findIndex((application) => item.ids.application_id === application.appId);
                if (index >= 0) {
                    parsedData.synchronized.push(applications[index]);
                }
                else {
                    parsedData.unsynchronized.push({
                        appId: item.ids.application_id,
                        name: item.name,
                    });
                }
            });
        }
        return parsedData;
    }
    async findOne(appId) {
        const application = await this.applicationsService.findOneWhere({
            appId,
        });
        const ttnApplication = await ttn_service_1.TtnService.get(`applications/${appId}`);
        return {
            ...application.toObject(),
            ttnSync: ttnApplication.data.ids.application_id === application.appId,
        };
    }
    async update(appId, updateApplicationDto) {
        const transactionSession = await this.connection.startSession();
        transactionSession.startTransaction();
        const updated = await this.applicationsService.update(appId, updateApplicationDto, transactionSession);
        await ttn_service_1.TtnService.put(`/applications/${appId}`, {
            application: {
                name: updateApplicationDto.name,
                description: updateApplicationDto.description,
            },
            field_mask: {
                paths: ['description', 'name'],
            },
        });
        await transactionSession.commitTransaction();
        transactionSession.endSession();
        return updated;
    }
    async remove(appIds) {
        const ids = appIds.split(',');
        for await (const appId of ids) {
            await this.applicationsService.remove(appId);
            await ttn_service_1.TtnService.delete(`/applications/${appId}`);
        }
        return {
            deleted: true,
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_application_dto_1.CreateApplicationDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':appId'),
    __param(0, (0, common_1.Param)('appId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':appId'),
    __param(0, (0, common_1.Param)('appId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_application_dto_1.UpdateApplicationDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':appIds'),
    __param(0, (0, common_1.Param)('appIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "remove", null);
ApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('Aplicações'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(Role_1.Role.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Controller)('applications'),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose.Connection, applications_service_1.ApplicationsService])
], ApplicationsController);
exports.ApplicationsController = ApplicationsController;
//# sourceMappingURL=applications.controller.js.map