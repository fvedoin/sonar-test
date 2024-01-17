import { EnergyService } from './energy.service';
import { InfluxConnectionsService } from 'src/influx-connections/influx-connections.service';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';
import { UcsService } from 'src/ucs/ucs.service';
import { MeterChangeRepository } from 'src/meter-change/meter-change.repository';
declare type ISOString = string;
export declare class EnergyController {
    private readonly energyService;
    private readonly ucsService;
    private readonly influxConnection;
    private readonly influxBuckets;
    private readonly meterChange;
    constructor(energyService: EnergyService, ucsService: UcsService, influxConnection: InfluxConnectionsService, influxBuckets: InfluxBucketsService, meterChange: MeterChangeRepository);
    findEnergy(uc: string[], field: string, timeGroup: string, dateRange: {
        endDate: ISOString;
        startDate: ISOString;
    }): Promise<string[][]>;
    findEnergyTotal(uc: string[], field: string, dateRange: {
        endDate: ISOString;
        startDate: ISOString;
    }): Promise<import("./energy.service").EnergyResult>;
    findEnergyPredictionTotal(uc: string[], field: string, dateRange: {
        endDate: ISOString;
        startDate: ISOString;
    }): Promise<import("./energy.service").EnergyResult>;
    findEnergyPrediction(uc: string[], field: string, timeGroup: string, dateRange: {
        endDate: ISOString;
        startDate: ISOString;
    }): Promise<string[][]>;
}
export {};
