export declare class CreateDevicesGbDto {
    name: string;
    devId: string;
    databaseId?: string;
    devEui?: string;
    appEui?: string;
    lorawanVersion?: string;
    lorawanPhyVersion?: string;
    frequencyPlanId?: string;
    supportsJoin?: string;
    appKey?: string;
    password?: string;
    topics?: string[];
    username?: string;
    type: string;
    description?: string;
    communication: string;
    allows: Array<string>;
    clientId: string;
    bucketId: string;
    applicationId?: string;
    brokerAttributeId?: string;
}
