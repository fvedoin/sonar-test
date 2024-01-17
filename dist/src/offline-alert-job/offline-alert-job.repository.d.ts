import { Connection, Model } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { OfflineAlertJob } from './entities/offline-alert-job.entity';
export declare class OfflineAlertJobRepository extends AbstractRepository<OfflineAlertJob> {
    private offlineAlertJobModel;
    constructor(offlineAlertJobModel: Model<OfflineAlertJob>, connection: Connection);
    updateDeviceId(oldDeviceId: any, newDeviceId: any, session: any): Promise<import("mongodb").UpdateResult>;
    remove(obj: any): Promise<import("mongodb").DeleteResult>;
}
