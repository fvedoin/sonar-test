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
exports.AreaService = void 0;
const common_1 = require("@nestjs/common");
const Role_1 = require("../auth/models/Role");
const area_repository_1 = require("./area.repository");
let AreaService = class AreaService {
    constructor(areaRepository) {
        this.areaRepository = areaRepository;
    }
    async create(createAreaDto, user) {
        if (!createAreaDto.clientId && user.accessLevel === Role_1.Role.SUPER_ADMIN) {
            throw new common_1.HttpException('ClientId é obrigatório', common_1.HttpStatus.BAD_REQUEST);
        }
        const parsedPoints = this.parsePoints(createAreaDto.points);
        if (user.accessLevel === Role_1.Role.SUPER_ADMIN) {
            return this.areaRepository.create({
                ...createAreaDto,
                points: parsedPoints,
            });
        }
        return this.areaRepository.create({
            ...createAreaDto,
            points: parsedPoints,
            clientId: user.clientId,
        });
    }
    parsePoints(points) {
        return points.map(({ lng, lat }) => ({
            type: 'Point',
            coordinates: [lng, lat],
        }));
    }
    findAll(user) {
        if (user.accessLevel === Role_1.Role.SUPER_ADMIN) {
            return this.areaRepository.findAllAndPopulate(['clientId']);
        }
        return this.areaRepository.findAndPopulate({ clientId: user.clientId }, [
            'clientId',
        ]);
    }
    findOne(id) {
        return this.areaRepository.findOne({ _id: id });
    }
    async update(id, updateAreaDto, user) {
        const parsedPoints = this.parsePoints(updateAreaDto.points);
        if (user.accessLevel === Role_1.Role.SUPER_ADMIN) {
            return this.areaRepository.findOneAndUpdate({ _id: id }, { ...updateAreaDto, points: parsedPoints });
        }
        return this.areaRepository.findOneAndUpdate({ _id: id }, {
            ...updateAreaDto,
            clientId: user.clientId,
            points: parsedPoints,
        });
    }
    async remove(id) {
        await this.areaRepository.deleteMany({ _id: { $in: id } });
    }
};
AreaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [area_repository_1.AreaRepository])
], AreaService);
exports.AreaService = AreaService;
//# sourceMappingURL=area.service.js.map