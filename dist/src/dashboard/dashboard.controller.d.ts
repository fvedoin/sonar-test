import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    lastHour(clientId: string): Promise<import("./dashboard.service").LastHourResult>;
}
