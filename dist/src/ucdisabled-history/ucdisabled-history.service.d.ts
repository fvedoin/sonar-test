import { CreateUcdisabledHistoryDto } from './dto/create-ucdisabled-history.dto';
import { UcdisabledHistoryRepository } from './ucdisabled-history.repository';
import { ClientSession } from 'mongoose';
export declare class UcdisabledHistoryService {
    private readonly ucdisabledHistoryRepository;
    constructor(ucdisabledHistoryRepository: UcdisabledHistoryRepository);
    create(createUcdisabledHistoryDto: CreateUcdisabledHistoryDto, session: ClientSession): Promise<import("./entities/ucdisabled-history.entity").UcdisabledHistory>;
    findAll(query: any): Promise<{
        data: any;
        pageInfo: any;
    }>;
    private buildGeneralWhereClause;
    private buildAggregatePipeline;
    findAllPopulate({ edges, searchText, filter, fieldMask }: any): Promise<{
        data: any;
        pageInfo: any;
    }>;
}
