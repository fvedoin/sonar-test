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
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsRepository extends AbstractRepository<Setting> {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
    @InjectConnection() connection: Connection,
  ) {
    super(settingModel, connection);
  }

  async findAllAndPopulate(populate: string[]) {
    return await this.settingModel.find().populate(populate);
  }

  async aggregate(pipeline: PipelineStage[], options?: AggregateOptions) {
    return await this.settingModel.aggregate(pipeline, options);
  }

  async deleteMany(options: FilterQuery<Setting>) {
    await this.settingModel.deleteMany(options);
  }
}
