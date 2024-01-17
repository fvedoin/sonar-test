import { Connection, Model } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { OnlineAlertJob } from './entities/online-alert-job.entity';
export declare class OnlineAlertJobRepository extends AbstractRepository<OnlineAlertJob> {
    private offlineAlertJobModel;
    constructor(offlineAlertJobModel: Model<OnlineAlertJob>, connection: Connection);
    updateDeviceId(oldDeviceId: any, newDeviceId: any, session: any): Promise<import("mongodb").UpdateResult>;
    remove(obj: any): Promise<import("mongodb").DeleteResult>;
}
