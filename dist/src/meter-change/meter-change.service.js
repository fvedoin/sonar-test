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
exports.MeterChangeService = void 0;
const common_1 = require("@nestjs/common");
const Role_1 = require("../auth/models/Role");
const meter_change_repository_1 = require("./meter-change.repository");
let MeterChangeService = class MeterChangeService {
    constructor(meterChangeRepository) {
        this.meterChangeRepository = meterChangeRepository;
    }
    create(createMeterChangeDto) {
        return this.meterChangeRepository.create(createMeterChangeDto);
    }
    findAll(user) {
        if (user.accessLevel === Role_1.Role.SUPER_ADMIN ||
            user.accessLevel === Role_1.Role.SUPPORT) {
            return this.meterChangeRepository.findAndPopulate({}, [
                'clientId',
                'deviceId',
            ]);
        }
        else {
            return this.meterChangeRepository.find({ clientId: user.clientId });
        }
    }
    findOne(_id) {
        return this.meterChangeRepository.findOne({ _id });
    }
    update(_id, updateMeterChangeDto) {
        return this.meterChangeRepository.findOneAndUpdate({ _id }, updateMeterChangeDto);
    }
    remove(id) {
        return this.meterChangeRepository.deleteMany({ _id: { $in: id } });
    }
};
MeterChangeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [meter_change_repository_1.MeterChangeRepository])
], MeterChangeService);
exports.MeterChangeService = MeterChangeService;
//# sourceMappingURL=meter-change.service.js.map