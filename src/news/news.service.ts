import { Injectable, Logger } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsRepository } from './news.repository';
import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';

@Injectable()
export class NewsService {
  private logger = new Logger(NewsService.name);

  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly awsS3ManagerService: AwsS3ManagerService,
  ) {}

  async create(_createNewsDto: CreateNewsDto, newImage: Express.Multer.File) {
    const imagePath = `news/${new Date().getTime()}-${newImage.originalname}`;

    const news = {
      ..._createNewsDto,
      image: imagePath,
    };

    if (newImage) {
      try {
        const bucket = process.env.AWS_BUCKET_FILES;

        await this.awsS3ManagerService.uploadFile({
          Bucket: bucket,
          Key: imagePath,
          Body: newImage.buffer,
        });
      } catch (error) {
        this.logger.warn(`Error uploading ${error.message}`);
        throw error;
      }
    }

    return await this.newsRepository.create(news);
  }

  findAll() {
    return this.newsRepository.find({});
  }

  async findOne(id: string) {
    const bucket = process.env.AWS_BUCKET_FILES;

    const news = await this.newsRepository.findOne({ _id: id });

    if (news.image) {
      const image = await this.awsS3ManagerService.fetchFromBucket(
        bucket,
        news.image,
      );

      news.image = image;
    }

    return news;
  }

  findMany(ids: string[]) {
    return this.newsRepository.find({ _id: { $in: ids } });
  }

  async update(
    id: string,
    updateNewsDto: UpdateNewsDto & { oldImage?: string },
    newImage: Express.Multer.File,
  ) {
    const session = await this.newsRepository.startTransaction();

    const updateNews: UpdateNewsDto = updateNewsDto;

    let updatedNews;

    try {
      updatedNews = await this.newsRepository.findOneAndUpdate(
        { _id: id },
        updateNews,
      );
    } catch (error) {
      await session.abortTransaction();

      throw error;
    }

    if (newImage) {
      try {
        const bucket = process.env.AWS_BUCKET_FILES;

        await this.awsS3ManagerService.uploadFile({
          Bucket: bucket,
          Key: updatedNews.image,
          Body: newImage.buffer,
        });
      } catch (error) {
        await session.abortTransaction();

        this.logger.warn(`Error uploading ${error.message}`);
        throw error;
      }
    }

    await session.commitTransaction();

    return updatedNews;
  }

  async remove(ids: string[]) {
    const session = await this.newsRepository.startTransaction();

    try {
      const news = await this.findMany(ids);

      await this.newsRepository.deleteMany(ids);

      for (const { image } of news) {
        try {
          const bucket = process.env.AWS_BUCKET_FILES;

          await this.awsS3ManagerService.deleteFile({
            Bucket: bucket,
            Key: image,
          });
        } catch (error) {
          await session.abortTransaction();

          this.logger.warn(`Error uploading ${error.message}`);
          throw error;
        }
      }

      await session.commitTransaction();

      return;
    } catch (error) {
      await session.abortTransaction();

      throw error;
    }
  }
}
