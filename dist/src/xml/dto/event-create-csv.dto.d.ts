import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { Uc } from 'src/ucs/entities/uc.entity';
declare type ISOString = string;
export declare class EventCreateCSV {
    nameFile: string;
    user: UserFromJwt;
    foundUcs: Uc[];
    dateRange: {
        startDate: ISOString;
        endDate: ISOString;
    };
    fields: string[];
    aggregation: string;
    communication?: string[];
}
export {};
