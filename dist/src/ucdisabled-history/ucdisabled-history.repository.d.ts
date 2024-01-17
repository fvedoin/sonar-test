import { AggregateOptions, Connection, Model, PipelineStage } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { UcdisabledHistory } from './entities/ucdisabled-history.entity';
export declare class UcdisabledHistoryRepository extends AbstractRepository<UcdisabledHistory> {
    private UcdisabledHistoryModel;
    constructor(UcdisabledHistoryModel: Model<UcdisabledHistory>, connection: Connection);
    aggregate(pipeline: PipelineStage[], options?: AggregateOptions): Promise<any[]>;
}
