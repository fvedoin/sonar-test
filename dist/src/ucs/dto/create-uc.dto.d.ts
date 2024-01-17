export declare class CreateUcDto {
    clientId: string | undefined;
    transformerId: string;
    deviceId: string | undefined;
    billingGroup: number;
    routeCode: number;
    ratedVoltage: number;
    ucCode: string;
    ucNumber: string;
    ucClass: string;
    subClass: string | undefined;
    group: string;
    subGroup: string;
    sequence: string;
    phases: string;
    circuitBreaker: number;
    microgeneration: boolean;
    city: string;
    district: string;
    latitude: number;
    longitude: number;
}
