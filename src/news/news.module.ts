import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { News, NewsSchema } from './entities/news.entity';
import { NewsController } from './news.controller';
import { NewsRepository } from './news.repository';
import { NewsService } from './news.service';
import { AwsS3ManagerModule } from 'src/aws-s3-manager/aws-s3-manager.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: News.name,
        schema: NewsSchema,
      },
    ]),
    AwsS3ManagerModule,
  ],
  controllers: [NewsController],
  providers: [NewsService, NewsRepository],
})
export class NewsModule {}
