import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Connection,
  FilterQuery,
  Types,
  ProjectionFields,
  PopulateOption,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Uc } from './entities/uc.entity';
import { DeviceGbDocument } from 'src/devices-gb/entities/devices-gb.entity';
import { PopulateOptions } from 'mongoose';

type UCPopulate = Uc & {
  deviceId: DeviceGbDocument & {
    clientId: string;
    bucketId: string;
  };
};

@Injectable()
export class UcsRepository extends AbstractRepository<Uc> {
  constructor(
    @InjectModel(Uc.name) private ucModel: Model<Uc>,
    @InjectConnection() connection: Connection,
  ) {
    super(ucModel, connection);
  }

  async findWithPopulate(
    query: FilterQuery<Uc>,
    projection: ProjectionFields<Uc> = {},
  ): Promise<UCPopulate[]> {
    return this.ucModel.find(query, projection).populate('deviceId').lean();
  }

  async findWherePopulate(whereClause: FilterQuery<Uc>, populate: string[]) {
    return await this.ucModel.find(whereClause).populate(populate);
  }

  async findByIdAndUpdate(id, uc, session?) {
    return await this.ucModel.findOneAndUpdate({ _id: id }, uc, { session });
  }

  async findWithOnePopulate(
    query: FilterQuery<Uc>,
    projection: ProjectionFields<Uc> = {},
  ): Promise<any> {
    return this.ucModel.findOne(query, projection).populate([
      'deviceId',
      'clientId',
      'settings',
      {
        path: 'lastReceived',
        options: { sort: { port: 1 } },
      },
    ]);
  }

  async findOneByUcCode(ucCode): Promise<any> {
    return this.ucModel.findOne({ ucCode });
  }

  async findWithAllPopulate(clientsIds: string[]): Promise<any> {
    const query: FilterQuery<Uc> = { clientId: { $in: clientsIds } };

    return this.ucModel.find(query).populate([
      'deviceId',
      'clientId',
      'settings',
      'transformerId',
      {
        path: 'lastReceived',
        options: { sort: { port: 1 } },
      },
    ]);
  }

  async findByIdWithPopulate(filterQuery: FilterQuery<Uc>, populate: string[]) {
    return this.ucModel.findById(filterQuery).populate(populate);
  }

  async findPopulatedAndSortLastReceivedByPort(filterQuery: FilterQuery<Uc>) {
    return this.ucModel.find(filterQuery).populate([
      'deviceId',
      'transformerId',
      'clientId',
      'settings',
      {
        path: 'lastReceived',
        options: { sort: { port: 1 } },
      },
    ]);
  }

  async countByDeviceId(deviceId: string | Types.ObjectId) {
    return this.ucModel.count({ deviceId });
  }

  async countByUcByDeviceId(deviceId: string, id: string) {
    return this.ucModel.count({ deviceId: deviceId, _id: { $ne: id } });
  }

  async deleteMany(ids: string[]) {
    await this.ucModel.deleteMany({ _id: { $in: ids } });
  }

  async updateDeviceId(oldDeviceId, newDeviceId, session) {
    return await this.ucModel.updateMany(
      { deviceId: oldDeviceId },
      { deviceId: newDeviceId },
      { session },
    );
  }

  async findPaginated(where, data) {
    const ucs = await this.ucModel.aggregate([
      {
        $lookup: {
          from: 'clients',
          localField: 'clientId',
          foreignField: '_id',
          as: 'clientId',
        },
      },
      {
        $unwind: {
          path: '$clientId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'devices',
          localField: 'deviceId',
          foreignField: '_id',
          as: 'deviceId',
        },
      },
      {
        $unwind: {
          path: '$deviceId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'transformers',
          localField: 'transformerId',
          foreignField: '_id',
          as: 'transformerId',
        },
      },
      {
        $unwind: {
          path: '$transformerId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'lastreceiveds',
          localField: 'deviceId._id',
          foreignField: 'deviceId',
          as: 'lastReceived',
        },
      },
      {
        $lookup: {
          from: 'settings',
          localField: 'clientId._id',
          foreignField: 'clientId',
          as: 'settings',
        },
      },
      {
        $unwind: {
          path: '$settings',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$lastReceived',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          transformerId: {
            $first: '$transformerId',
          },
          deviceId: {
            $first: '$deviceId',
          },
          clientId: {
            $first: '$clientId',
          },
          settings: {
            $first: '$settings',
          },
          lastReceived: {
            $push: '$lastReceived',
          },
          routeCode: {
            $first: '$routeCode',
          },
          ucCode: {
            $first: '$ucCode',
          },
          ucNumber: {
            $first: '$ucNumber',
          },
          ucClass: {
            $first: '$ucClass',
          },
          subClass: {
            $first: '$subClass',
          },
          billingGroup: {
            $first: '$billingGroup',
          },
          group: {
            $first: '$group',
          },
          ratedVoltage: {
            $first: '$ratedVoltage',
          },
          subGroup: {
            $first: '$subGroup',
          },
          sequence: {
            $first: '$sequence',
          },
          phases: {
            $first: '$phases',
          },
          isCutted: {
            $first: '$isCutted',
          },
          circuitBreaker: {
            $first: '$circuitBreaker',
          },
          microgeneration: {
            $first: '$microgeneration',
          },
          district: {
            $first: '$district',
          },
          timeZone: {
            $first: '$timeZone',
          },
          city: {
            $first: '$city',
          },
          location: {
            $first: '$location',
          },
        },
      },
      {
        $match: where,
      },
      {
        $facet: {
          data,
          pageInfo: [
            {
              $group: {
                _id: null,
                count: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
    ]);

    return {
      data: ucs[0].data,
      pageInfo: ucs[0].pageInfo[0],
    };
  }
}
