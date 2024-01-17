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
import { NotificationService } from './notification.service';
import { ClientsService } from 'src/clients/clients.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
export declare class NotificationController {
    private readonly notificationService;
    private readonly clientsService;
    constructor(notificationService: NotificationService, clientsService: ClientsService);
    create(createNotificationDto: CreateNotificationDto): Promise<import("mongoose").Document<unknown, any, import("./entities/notification.entity").Notification> & import("./entities/notification.entity").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAll(user: UserFromJwt): any;
    findOne(id: string): import("mongoose").Query<import("mongoose").Document<unknown, any, import("./entities/notification.entity").Notification> & import("./entities/notification.entity").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, import("./entities/notification.entity").Notification> & import("./entities/notification.entity").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("./entities/notification.entity").Notification> & import("./entities/notification.entity").Notification & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, updateNotificationDto: UpdateNotificationDto): import("mongoose").Query<import("mongoose").Document<unknown, any, import("./entities/notification.entity").Notification> & import("./entities/notification.entity").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, import("./entities/notification.entity").Notification> & import("./entities/notification.entity").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("./entities/notification.entity").Notification> & import("./entities/notification.entity").Notification & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: string): import("mongoose").Query<import("mongoose").Document<unknown, any, import("./entities/notification.entity").Notification> & import("./entities/notification.entity").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, import("mongoose").Document<unknown, any, import("./entities/notification.entity").Notification> & import("./entities/notification.entity").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, any, import("./entities/notification.entity").Notification> & import("./entities/notification.entity").Notification & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
