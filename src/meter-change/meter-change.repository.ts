import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection, FilterQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { MeterChanges } from './entities/meter-change.entity';

@Injectable()
export class MeterChangeRepository extends AbstractRepository<MeterChanges> {
  constructor(
    @InjectModel(MeterChanges.name)
    private meterChangeModel: Model<MeterChanges>,
    @InjectConnection() connection: Connection,
  ) {
    super(meterChangeModel, connection);
  }

  async findAndPopulate(
    filterQuery: FilterQuery<MeterChanges>,
    populate: string[],
  ) {
    return await this.meterChangeModel.find(filterQuery).populate(populate);
  }

  async deleteMany(options: FilterQuery<MeterChanges>) {
    await this.meterChangeModel.deleteMany(options);
  }

  async updateDeviceId(oldDeviceId, newDeviceId, session) {
    return this.meterChangeModel.updateMany(
      { deviceId: oldDeviceId },
      { deviceId: newDeviceId },
      { session },
    );
  }
}
