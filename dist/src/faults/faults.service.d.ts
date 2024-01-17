import { InfluxBucketRepository } from 'src/influx-buckets/influx-buckets.repository';
import { InfluxConnectionRepository } from 'src/influx-connections/influx-connections.repository';
import { InfluxService } from 'src/influx/influx.service';
import DataInfluxFindFaults from 'src/influx/interfaces/dataInfluxFindFaults';
import { UcsRepository } from 'src/ucs/ucs.repository';
export declare class FaultsService {
    private readonly influxBucketRepository;
    private readonly influxConnectionRepository;
    private readonly influxService;
    private readonly ucRepository;
    private logger;
    constructor(influxBucketRepository: InfluxBucketRepository, influxConnectionRepository: InfluxConnectionRepository, influxService: InfluxService, ucRepository: UcsRepository);
    exportCSV({ ucs, dateRange, userId, }: {
        ucs: string;
        dateRange: any;
        userId: string;
    }): Promise<{
        csvdoc: any[][];
        jsondoc: ({
            uc: number;
            timeZone: string;
            tr: string;
            feeder: string;
        } & DataInfluxFindFaults)[];
    }>;
}
