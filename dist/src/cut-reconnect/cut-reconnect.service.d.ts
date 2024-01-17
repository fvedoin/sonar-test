import { CutConnectRepository } from './cut-reconnect.repository';
import { CutReconnect } from './entities/cut-reconnect.entity';
import { FilterQuery } from 'mongoose';
export declare class CutReconnectService {
    private readonly cutConnectRepository;
    constructor(cutConnectRepository: CutConnectRepository);
    findWhere(where: FilterQuery<CutReconnect>): Promise<any>;
}
