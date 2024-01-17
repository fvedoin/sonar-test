import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  Model,
  Connection,
  FilterQuery,
  AggregateOptions,
  PipelineStage,
} from 'mongoose';
import { Injectable } from '@nestjs/common';
import { DeviceTr } from './entities/devices-tr.entity';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class DevicesTrRepository extends AbstractRepository<DeviceTr> {
  constructor(
    @InjectModel(DeviceTr.name) private deviceTrModel: Model<DeviceTr>,
    @InjectConnection() connection: Connection,
    private readonly clientService: ClientsService,
  ) {
    super(deviceTrModel, connection);
  }

  async findAllAndPopulate(populate: string[]) {
    return await this.deviceTrModel.find().populate(populate);
  }

  async deleteMany(options: FilterQuery<Transformer>) {
    await this.deviceTrModel.deleteMany(options);
  }

  async findChildClients(clientId: string) {
    return await this.clientService.findWhere({
      $or: [{ parentId: clientId }, { _id: clientId }],
    });
  }

  async aggregate(pipeline: PipelineStage[], options?: AggregateOptions) {
    return await this.deviceTrModel.aggregate(pipeline, options);
  }
}
