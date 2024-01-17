"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NewsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const news_repository_1 = require("./news.repository");
const aws_s3_manager_service_1 = require("../aws-s3-manager/aws-s3-manager.service");
let NewsService = NewsService_1 = class NewsService {
    constructor(newsRepository, awsS3ManagerService) {
        this.newsRepository = newsRepository;
        this.awsS3ManagerService = awsS3ManagerService;
        this.logger = new common_1.Logger(NewsService_1.name);
    }
    async create(_createNewsDto, newImage) {
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
            }
            catch (error) {
                this.logger.warn(`Error uploading ${error.message}`);
                throw error;
            }
        }
        return await this.newsRepository.create(news);
    }
    findAll() {
        return this.newsRepository.find({});
    }
    async findOne(id) {
        const bucket = process.env.AWS_BUCKET_FILES;
        const news = await this.newsRepository.findOne({ _id: id });
        if (news.image) {
            const image = await this.awsS3ManagerService.fetchFromBucket(bucket, news.image);
            news.image = image;
        }
        return news;
    }
    findMany(ids) {
        return this.newsRepository.find({ _id: { $in: ids } });
    }
    async update(id, updateNewsDto, newImage) {
        const session = await this.newsRepository.startTransaction();
        const updateNews = updateNewsDto;
        let updatedNews;
        try {
            updatedNews = await this.newsRepository.findOneAndUpdate({ _id: id }, updateNews);
        }
        catch (error) {
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
            }
            catch (error) {
                await session.abortTransaction();
                this.logger.warn(`Error uploading ${error.message}`);
                throw error;
            }
        }
        await session.commitTransaction();
        return updatedNews;
    }
    async remove(ids) {
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
                }
                catch (error) {
                    await session.abortTransaction();
                    this.logger.warn(`Error uploading ${error.message}`);
                    throw error;
                }
            }
            await session.commitTransaction();
            return;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
    }
};
NewsService = NewsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [news_repository_1.NewsRepository,
        aws_s3_manager_service_1.AwsS3ManagerService])
], NewsService);
exports.NewsService = NewsService;
//# sourceMappingURL=news.service.js.map