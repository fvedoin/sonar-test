import { InfluxDB } from '@influxdata/influxdb-client';
export declare class InfluxRepository {
    connection(url: string, token: string): Promise<InfluxDB>;
}
