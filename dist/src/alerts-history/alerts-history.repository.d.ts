import { AggregateOptions, Connection, Model, PipelineStage } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { AlertHistory } from './entities/alerts-history.entity';
export declare class AlertsHistoryRepository extends AbstractRepository<AlertHistory> {
    private alertsHistoryModel;
    constructor(alertsHistoryModel: Model<AlertHistory>, connection: Connection);
    aggregate(pipeline: PipelineStage[], options?: AggregateOptions): Promise<any[]>;
}
