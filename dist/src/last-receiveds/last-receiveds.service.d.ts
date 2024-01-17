import { LastReceivedsRepository } from './last-receiveds.repository';
import { FilterQuery, ProjectionFields } from 'mongoose';
import { LastReceived } from './entities/last-received.entity';
export declare class LastReceivedsService {
    private readonly lastReceivedsRepository;
    constructor(lastReceivedsRepository: LastReceivedsRepository);
    find(query: FilterQuery<LastReceived>, projection?: ProjectionFields<LastReceived>): Promise<Partial<LastReceived[]>>;
}
