import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { Alert } from './entities/alert.entity';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AlertRepository extends AbstractRepository<Alert> {
  constructor(
    @InjectModel(Alert.name)
    private alertModel: Model<Alert>,
    @InjectConnection() connection: Connection,
  ) {
    super(alertModel, connection);
  }

  async deleteMany(where): Promise<void> {
    await this.alertModel.deleteMany(where);
  }

  async findAllAndPopulate(populate: string[]) {
    return await this.alertModel.find().populate(populate);
  }

  async findByDeviceId(deviceId) {
    return await this.alertModel.find({ deviceId: deviceId });
  }

  async updateDeviceId(oldDeviceId, newDeviceId, session) {
    return await this.alertModel.updateMany(
      { deviceId: oldDeviceId },
      { deviceId: newDeviceId },
      { session },
    );
  }
}
