import { AbstractRepository } from '../common/database/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { News } from './entities/news.entity';

@Injectable()
export class NewsRepository extends AbstractRepository<News> {
  constructor(
    @InjectModel(News.name) private newsModel: Model<News>,
    @InjectConnection() connection: Connection,
  ) {
    super(newsModel, connection);
  }
  deleteMany(ids: string[]) {
    return this.newsModel.deleteMany({ _id: { $in: ids } }).exec();
  }
}
