import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { Uc } from 'src/ucs/entities/uc.entity';
declare type ISOString = string;
export declare class EventCreateCSVQuality {
    nameFile: string;
    user: UserFromJwt;
    foundUcs: Uc[];
    dateRange: {
        startDate: ISOString;
        endDate: ISOString;
    };
    fields: string[];
}
export {};
