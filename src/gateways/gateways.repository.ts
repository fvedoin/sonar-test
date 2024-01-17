import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Connection,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Gateway } from './entities/gateway.entity';

@Injectable()
export class GatewaysRepository extends AbstractRepository<Gateway> {
  constructor(
    @InjectModel(Gateway.name) private gatewayModel: Model<Gateway>,
    @InjectConnection() connection: Connection,
  ) {
    super(gatewayModel, connection);
  }

  async findOneAndPopulate(where, populate) {
    const query = this.gatewayModel.findOne(where);
    if (populate) {
      query.populate(populate);
    }
    return await query.exec();
  }

  async findOneAndUpdateWithArgs(
    conditions: FilterQuery<Gateway>,
    update: UpdateQuery<Gateway>,
    options: QueryOptions,
  ): Promise<Gateway | null> {
    return this.gatewayModel
      .findOneAndUpdate(conditions, update, options)
      .exec();
  }
}
