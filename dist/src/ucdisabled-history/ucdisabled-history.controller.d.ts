import { UcdisabledHistoryService } from './ucdisabled-history.service';
import { CreateUcdisabledHistoryDto } from './dto/create-ucdisabled-history.dto';
import { FindUcDisableHistoryDto } from './dto/find-ucdisabled-history.dto';
import { ClientSession } from 'mongoose';
export declare class UcdisabledHistoryController {
    private readonly ucdisabledHistoryService;
    constructor(ucdisabledHistoryService: UcdisabledHistoryService);
    create(createUcdisabledHistoryDto: CreateUcdisabledHistoryDto, session: ClientSession): Promise<import("./entities/ucdisabled-history.entity").UcdisabledHistory>;
    findAll(query: FindUcDisableHistoryDto): Promise<{
        data: any;
        pageInfo: any;
    }>;
}
