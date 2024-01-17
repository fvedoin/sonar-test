import { AbstractRepository } from '../common/database/abstract.repository';
import { Model, Connection, FilterQuery } from 'mongoose';
import { CutReconnect } from './entities/cut-reconnect.entity';
export declare class CutConnectRepository extends AbstractRepository<CutReconnect> {
    private cutReconnect;
    constructor(cutReconnect: Model<CutReconnect>, connection: Connection);
    findWhere(whereClause: FilterQuery<any>): Promise<any>;
    updateDeviceId(oldDeviceId: any, newDeviceId: any, session: any): Promise<import("mongodb").UpdateResult>;
}
