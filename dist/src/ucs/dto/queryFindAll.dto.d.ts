export declare class QueryFindAllDto {
    clientId: string;
    deviceType: 'LoRa' | 'GSM';
    allows: string;
    transformerId: string;
}
export declare class QueryFindAllPaginateDto {
    sort?: string;
    skip?: string;
    limit?: string;
    searchText?: string;
    filter?: {
        [key: string | number]: unknown | string;
    }[];
    fieldMask?: string;
    clientId?: string;
}
