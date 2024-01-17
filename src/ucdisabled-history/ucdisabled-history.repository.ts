import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { AggregateOptions, Connection, Model, PipelineStage } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { UcdisabledHistory } from './entities/ucdisabled-history.entity';

@Injectable()
export class UcdisabledHistoryRepository extends AbstractRepository<UcdisabledHistory> {
  constructor(
    @InjectModel(UcdisabledHistory.name)
    private UcdisabledHistoryModel: Model<UcdisabledHistory>,
    @InjectConnection() connection: Connection,
  ) {
    super(UcdisabledHistoryModel, connection);
  }

  async aggregate(pipeline: PipelineStage[], options?: AggregateOptions) {
    return await this.UcdisabledHistoryModel.aggregate(pipeline, options);
  }
}
