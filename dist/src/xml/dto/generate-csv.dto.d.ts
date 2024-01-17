declare type ISOString = string;
export declare class GenerateCSV {
    nameFile: string;
    ucCodes: string[];
    dateRange: {
        startDate: ISOString;
        endDate: ISOString;
    };
    fields: string[];
    aggregation: string;
}
export {};
