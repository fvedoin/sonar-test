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
/// <reference types="mongoose/types/inferschematype" />
import { FilterQuery } from 'mongoose';
import { AwsS3ManagerService } from 'src/aws-s3-manager/aws-s3-manager.service';
import { RabbitMQService } from 'src/rabbit-mq/rabbit-mq.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SanitizeUser } from './dto/sanitarize-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { UsersRepository } from './users.repository';
export declare class UsersService {
    private readonly userRepository;
    private readonly rabbitMQService;
    private readonly awsS3ManagerService;
    private logger;
    constructor(userRepository: UsersRepository, rabbitMQService: RabbitMQService, awsS3ManagerService: AwsS3ManagerService);
    sanitizeUserData(user: User): Promise<SanitizeUser>;
    create(createUserDto: CreateUserDto): Promise<SanitizeUser>;
    verifyCode(code: number, userId: string): Promise<{
        code: number;
    }>;
    private getBucket;
    getProfile(userId: string): Promise<SanitizeUser>;
    updateProfile({ name, phone, oldImage, username, userId, newImage, }: {
        name: string;
        phone: string;
        oldImage?: string;
        username: string;
        userId: string;
        newImage?: Express.Multer.File;
    }): Promise<SanitizeUser>;
    generateCode(userId: string): Promise<SanitizeUser>;
    updatePassword(userId: any, password: any): Promise<SanitizeUser>;
    findAll(): Promise<(import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findWhere(where: FilterQuery<UserDocument>): Promise<(import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findCompleteByUsername(username: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    remove(userId: string): Promise<void>;
}
