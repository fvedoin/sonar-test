import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { LastReceived } from './entities/last-received.entity';

@Injectable()
export class LastReceivedsRepository extends AbstractRepository<LastReceived> {
  constructor(
    @InjectModel(LastReceived.name)
    private lastReceivedModel: Model<LastReceived>,
    @InjectConnection() connection: Connection,
  ) {
    super(lastReceivedModel, connection);
  }

  async findByDeviceId(deviceId) {
    return this.lastReceivedModel.find({ deviceId: deviceId });
  }

  async updateDeviceId(oldDeviceId, newDeviceId, session) {
    return this.lastReceivedModel.updateMany(
      { deviceId: oldDeviceId },
      { deviceId: newDeviceId },
      { session },
    );
  }

  async deleteMany(whereClause, session) {
    return this.lastReceivedModel.deleteMany(whereClause, { session });
  }
}
