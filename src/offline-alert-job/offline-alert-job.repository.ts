import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { OfflineAlertJob } from './entities/offline-alert-job.entity';

@Injectable()
export class OfflineAlertJobRepository extends AbstractRepository<OfflineAlertJob> {
  constructor(
    @InjectModel(OfflineAlertJob.name)
    private offlineAlertJobModel: Model<OfflineAlertJob>,
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
