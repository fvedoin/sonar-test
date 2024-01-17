import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { Job } from './entities/job.entity';

@Injectable()
export class JobRepository extends AbstractRepository<Job> {
  constructor(
    @InjectModel(Job.name)
    private offlineAlertJobModel: Model<Job>,
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
