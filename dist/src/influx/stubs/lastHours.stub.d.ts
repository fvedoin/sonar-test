export declare const lastHourStubs: () => {
    _id: string;
    microgeneration: boolean;
    isCutted: boolean;
    clientId: string;
    transformerId: string;
    ucCode: string;
    timeZone: string;
    location: {
        type: string;
        coordinates: number[];
        _id: string;
    };
    ucNumber: string;
    ucClass: string;
    subclass: string;
    billingGroup: number;
    group: string;
    routeCode: number;
    sequence: string;
    phases: string;
    circuitBreaker: string;
    district: string;
    city: string;
    subGroup: string;
    __v: number;
    deviceId: {
        _id: string;
        allows: string[];
        clientId: string;
        devId: string;
        type: string;
        communication: string;
        __v: number;
        bucketId: string;
        brokerAttributeId: any;
        description: any;
        name: string;
        applicationId: string;
    };
    ratedVoltage: number;
    lastHour: {
        phase_a: {
            min: number;
            max: number;
        };
        phase_b: {
            min: number;
            max: number;
        };
        phase_c: {
            min: number;
            max: number;
        };
    };
};
