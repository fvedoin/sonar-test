export interface EnergyProps {
    field: string;
    devsIds: string[];
    begin: string;
    end: string;
    urlDb: string;
    tokenDb: string;
    bucket: string;
}
export interface EnergyByGroupProps extends Omit<EnergyProps, 'begin' | 'end'> {
    group: string;
    begin: number;
    end: number;
}
export interface EnergyResult {
    result: 'first' | '_result' | 'last';
    table: number;
    _time?: string;
    _value: number;
    _field?: string;
    dev_id: string;
}
export declare class EnergyService {
    findEnergy({ field, devsIds, begin, end, group, urlDb, tokenDb, bucket, }: EnergyByGroupProps): Promise<EnergyResult[]>;
    findEnergyTotal({ field, devsIds, begin, end, urlDb, tokenDb, bucket, }: Omit<EnergyProps, 'begin' | 'end'> & {
        begin: number;
        end: number;
    }): Promise<EnergyResult[]>;
    findEnergyPrediction({ field, devsIds, begin, end, group, urlDb, tokenDb, bucket, }: EnergyByGroupProps): Promise<EnergyResult[]>;
    findEnergyPredictionTotal({ field, devsIds, begin, end, urlDb, tokenDb, bucket, }: EnergyProps): Promise<EnergyResult[]>;
}
