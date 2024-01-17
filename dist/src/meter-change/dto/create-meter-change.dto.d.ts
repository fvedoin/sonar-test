export declare class CreateMeterChangeDto {
    clientId: string;
    deviceId: string;
    ucCode: string;
    lastConsumedOldMeter: number;
    firstConsumedNewMeter: number;
    changedAt: Date;
    firstGeneratedNewMeter: number;
    lastGeneratedOldMeter: number;
}
