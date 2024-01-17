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
import { ClientsService } from 'src/clients/clients.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    private readonly clientsService;
    constructor(usersService: UsersService, clientsService: ClientsService);
    create(createUserDto: CreateUserDto): Promise<import("./dto/sanitarize-user.dto").SanitizeUser>;
    getMe(user: User): User;
    findAll(user: User): Promise<(import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, any, User> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    generateChangeCode(userId: string): Promise<import("./dto/sanitarize-user.dto").SanitizeUser>;
    verifyCode(userId: string, { code }: {
        code: number;
    }): Promise<{
        code: number;
    }>;
    updateProfile({ name, phone, oldImage, username, }: {
        name: string;
        phone: string;
        oldImage: string;
        username: string;
    }, userId: string, image: Express.Multer.File): Promise<import("./dto/sanitarize-user.dto").SanitizeUser>;
    getProfile(userId: string): Promise<import("./dto/sanitarize-user.dto").SanitizeUser>;
    remove(id: string): Promise<void>;
}
