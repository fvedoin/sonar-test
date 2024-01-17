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
import { Transformer } from './entities/transformer.entity';

@Injectable()
export class TransformersRepository extends AbstractRepository<Transformer> {
  constructor(
    @InjectModel(Transformer.name) private transformerModel: Model<Transformer>,
    @InjectConnection() connection: Connection,
  ) {
    super(transformerModel, connection);
  }

  async findAllAndPopulate(populate: string[]) {
    return await this.transformerModel.find().populate(populate);
  }

  async findWhereAndPopulate(
    where: FilterQuery<Transformer>,
    populate: string[],
  ) {
    return await this.transformerModel.find(where).populate(populate);
  }

  async deleteMany(options: FilterQuery<Transformer>) {
    await this.transformerModel.deleteMany(options);
  }

  async aggregate(pipeline: PipelineStage[], options?: AggregateOptions) {
    return await this.transformerModel.aggregate(pipeline, options);
  }
}
