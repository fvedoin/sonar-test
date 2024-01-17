import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ProjectionFields } from 'mongoose';

import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  create(_createNotificationDto: CreateNotificationDto) {
    const createdNotification = new this.notificationModel(
      _createNotificationDto,
    );
    return createdNotification.save();
  }

  findAll() {
    return this.notificationModel.find();
  }

  findByClientId(clientId: string, projection: ProjectionFields<Notification>) {
    return this.notificationModel.find({ clientId }, projection).lean();
  }

  findAllByclientIdOrNotExist(clientId: string) {
    return this.notificationModel.find({
      $or: [{ clientId: { $exists: false } }, { clientId }],
    });
  }

  findAllByClientNotExist() {
    return this.notificationModel.find({ clientId: { $exists: false } });
  }

  findAllByClientIdAndParentId(clientId: string, parentId: string) {
    return this.notificationModel.find({
      $or: [
        { clientId },
        { clientId: parentId },
        { clientId: { $exists: false } },
      ],
    });
  }

  findOne(id: string) {
    return this.notificationModel.findById(id);
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return this.notificationModel.findByIdAndUpdate(id, updateNotificationDto);
  }

  remove(id: string) {
    return this.notificationModel.findByIdAndDelete(id);
  }
}
