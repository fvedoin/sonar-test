import mongoose, { HydratedDocument } from 'mongoose';
export declare type NotificationDocument = HydratedDocument<Notification>;
export declare class Notification {
    title: string;
    message: string;
    clientId: string;
    createdAt: Date;
}
export declare const NotificationSchema: mongoose.Schema<Notification, mongoose.Model<Notification, any, any, any, any>, {}, {}, {}, {}, "type", Notification>;
