import { AlertsHistoryRepository } from './alerts-history.repository';
import { FindAlertsHistoryDto } from './dto/find-alerts-history';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
export declare class AlertsHistoryService {
    private readonly alertsHistoryRepository;
    constructor(alertsHistoryRepository: AlertsHistoryRepository);
    findAll(query: FindAlertsHistoryDto, user: UserFromJwt): Promise<{
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
