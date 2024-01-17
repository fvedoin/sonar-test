import { Types } from 'mongoose';
export declare class CreateDevicesTrDto {
    clientId: Types.ObjectId | string;
    databaseId: Types.ObjectId | string;
    devId: string;
    name: string;
    type: string;
    applicationId?: Types.ObjectId | string;
    bucketId?: Types.ObjectId | string;
    mqttApplicationId?: Types.ObjectId | string;
    topics?: string[];
    username?: string;
    password?: string;
}
