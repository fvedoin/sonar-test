import { AlertsHistoryService } from './alerts-history.service';
import { FindAlertsHistoryDto } from './dto/find-alerts-history';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
export declare class AlertsHistoryController {
    private readonly alertsHistoryService;
    constructor(alertsHistoryService: AlertsHistoryService);
    findAll(query: FindAlertsHistoryDto, user: UserFromJwt): Promise<{
        data: any;
        pageInfo: any;
    }>;
}
