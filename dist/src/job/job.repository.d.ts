import { Connection, Model } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';
import { Job } from './entities/job.entity';
export declare class JobRepository extends AbstractRepository<Job> {
    private offlineAlertJobModel;
    constructor(offlineAlertJobModel: Model<Job>, connection: Connection);
    updateDeviceId(oldDeviceId: any, newDeviceId: any, session: any): Promise<import("mongodb").UpdateResult>;
    remove(obj: any): Promise<import("mongodb").DeleteResult>;
}
