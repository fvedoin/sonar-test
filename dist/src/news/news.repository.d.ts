import { AbstractRepository } from '../common/database/abstract.repository';
import { Model, Connection } from 'mongoose';
import { News } from './entities/news.entity';
export declare class NewsRepository extends AbstractRepository<News> {
    private newsModel;
    constructor(newsModel: Model<News>, connection: Connection);
    deleteMany(ids: string[]): Promise<import("mongodb").DeleteResult>;
}
