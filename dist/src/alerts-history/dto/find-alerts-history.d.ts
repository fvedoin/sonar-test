export declare class FindAlertsHistoryDto {
    clientId: string;
    sort: string;
    skip: string;
    limit: string;
    searchText: string;
    filter: {
        [key: string | number]: unknown;
    }[];
    fieldMask: string;
}
