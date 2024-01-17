import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { OnlineAlertJob } from './entities/online-alert-job.entity';

@Injectable()
export class OnlineAlertJobRepository extends AbstractRepository<OnlineAlertJob> {
  constructor(
    @InjectModel(OnlineAlertJob.name)
    private offlineAlertJobModel: Model<OnlineAlertJob>,
    @InjectConnection() connection: Connection,
  ) {
    super(offlineAlertJobModel, connection);
  }

  async updateDeviceId(oldDeviceId, newDeviceId, session) {
    return await this.offlineAlertJobModel.updateMany(
      { deviceId: oldDeviceId },
      { deviceId: newDeviceId },
      { session },
    );
  }

  async remove(obj) {
    return await this.offlineAlertJobModel.deleteOne(obj);
  }
}
