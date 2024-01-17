import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { AggregateOptions, Connection, Model, PipelineStage } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { AlertHistory } from './entities/alerts-history.entity';

@Injectable()
export class AlertsHistoryRepository extends AbstractRepository<AlertHistory> {
  constructor(
    @InjectModel(AlertHistory.name)
    private alertsHistoryModel: Model<AlertHistory>,
    @InjectConnection() connection: Connection,
  ) {
    super(alertsHistoryModel, connection);
  }

  async aggregate(pipeline: PipelineStage[], options?: AggregateOptions) {
    return await this.alertsHistoryModel.aggregate(pipeline, options);
  }
}
