import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection, FilterQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CutReconnect } from './entities/cut-reconnect.entity';

@Injectable()
export class CutConnectRepository extends AbstractRepository<CutReconnect> {
  constructor(
    @InjectModel(CutReconnect.name) private cutReconnect: Model<CutReconnect>,
    @InjectConnection() connection: Connection,
  ) {
    super(cutReconnect, connection);
  }

  async findWhere(whereClause: FilterQuery<any>): Promise<any> {
    return this.cutReconnect
      .aggregate([
        {
          $match: whereClause,
        },
        {
          $lookup: {
            from: 'ucs',
            localField: 'deviceId',
            foreignField: 'deviceId',
            as: 'uc',
          },
        },
        {
          $unwind: {
            path: '$uc',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            createdAt: { $first: '$createdAt' },
            deviceId: { $first: '$deviceId' },
            status: { $first: '$status' },
            tech: { $first: '$tech' },
            type: { $first: '$type' },
            updatedAt: { $first: '$updatedAt' },
            userId: { $first: '$userId' },
            uc: { $first: '$uc' },
          },
        },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            updatedAt: 1,
            type: 1,
            tech: 1,
            status: 1,
            deviceId: 1,
            userId: 1,
            uc: 1,
          },
        },
      ])
      .exec();
  }

  async updateDeviceId(oldDeviceId, newDeviceId, session) {
    return await this.cutReconnect.updateMany(
      { deviceId: oldDeviceId },
      { deviceId: newDeviceId },
      { session },
    );
  }
}
