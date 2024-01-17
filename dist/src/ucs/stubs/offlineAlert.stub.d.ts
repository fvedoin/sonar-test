import { Types } from 'mongoose';
import { CreateOfflineAlertJobDto } from 'src/offline-alert-job/dto/create-offline-alert-job.dto';
export declare const offlineAlertStubs: (_id: Types.ObjectId, dto: Partial<CreateOfflineAlertJobDto>) => {
    triggerAt?: Date;
    alertId?: string;
    deviceId?: string;
    createdAt?: Date;
    _id: Types.ObjectId;
};
export declare const offlineAlertDtoStubs: (dto?: Partial<CreateOfflineAlertJobDto>) => CreateOfflineAlertJobDto;
