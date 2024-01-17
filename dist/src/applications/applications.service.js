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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const application_entity_1 = require("./entities/application.entity");
let ApplicationsService = class ApplicationsService {
    constructor(applicationModel) {
        this.applicationModel = applicationModel;
    }
    create(createApplicationDto, token, session) {
        const application = new this.applicationModel({
            ...createApplicationDto,
            token,
        });
        return application.save({ session });
    }
    async findAll() {
        return this.applicationModel.find();
    }
    findOne(id) {
        return this.applicationModel.findById(id);
    }
    async findWhere(where) {
        return this.applicationModel.find(where);
    }
    async findOneWhere(where) {
        return this.applicationModel.findOne(where);
    }
    update(appId, updateApplicationDto, session) {
        return this.applicationModel.findOneAndUpdate({ appId }, updateApplicationDto, { session });
    }
    remove(appId) {
        return this.applicationModel.deleteOne({ appId }).exec();
    }
};
ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(application_entity_1.Application.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ApplicationsService);
exports.ApplicationsService = ApplicationsService;
//# sourceMappingURL=applications.service.js.map