/// <reference types="multer" />
/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsRepository } from './news.repository';
import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';
export declare class NewsService {
    private readonly newsRepository;
    private readonly awsS3ManagerService;
    private logger;
    constructor(newsRepository: NewsRepository, awsS3ManagerService: AwsS3ManagerService);
    create(_createNewsDto: CreateNewsDto, newImage: Express.Multer.File): Promise<import("./entities/news.entity").News>;
    findAll(): Promise<(import("mongoose").Document<unknown, any, import("./entities/news.entity").News> & import("./entities/news.entity").News & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("./entities/news.entity").News>;
    findMany(ids: string[]): Promise<(import("mongoose").Document<unknown, any, import("./entities/news.entity").News> & import("./entities/news.entity").News & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    update(id: string, updateNewsDto: UpdateNewsDto & {
        oldImage?: string;
    }, newImage: Express.Multer.File): Promise<any>;
    remove(ids: string[]): Promise<void>;
}
