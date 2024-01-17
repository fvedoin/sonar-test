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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_entity_1 = require("./entities/notification.entity");
let NotificationService = class NotificationService {
    constructor(notificationModel) {
        this.notificationModel = notificationModel;
    }
    create(_createNotificationDto) {
        const createdNotification = new this.notificationModel(_createNotificationDto);
        return createdNotification.save();
    }
    findAll() {
        return this.notificationModel.find();
    }
    findByClientId(clientId, projection) {
        return this.notificationModel.find({ clientId }, projection).lean();
    }
    findAllByclientIdOrNotExist(clientId) {
        return this.notificationModel.find({
            $or: [{ clientId: { $exists: false } }, { clientId }],
        });
    }
    findAllByClientNotExist() {
        return this.notificationModel.find({ clientId: { $exists: false } });
    }
    findAllByClientIdAndParentId(clientId, parentId) {
        return this.notificationModel.find({
            $or: [
                { clientId },
                { clientId: parentId },
                { clientId: { $exists: false } },
            ],
        });
    }
    findOne(id) {
        return this.notificationModel.findById(id);
    }
    update(id, updateNotificationDto) {
        return this.notificationModel.findByIdAndUpdate(id, updateNotificationDto);
    }
    remove(id) {
        return this.notificationModel.findByIdAndDelete(id);
    }
};
NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_entity_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map