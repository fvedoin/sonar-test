import { FaultsService } from './faults.service';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
export declare class FaultsController {
    private readonly faultsService;
    constructor(faultsService: FaultsService);
    exportCSV({ ucs, dateRange }: any, user: UserFromJwt): Promise<{
        csvdoc: any[][];
        jsondoc: ({
            uc: number;
            timeZone: string;
            tr: string;
            feeder: string;
        } & import("../influx/interfaces/dataInfluxFindFaults").default)[];
    }>;
}
