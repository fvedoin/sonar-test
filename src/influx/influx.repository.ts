import { InfluxDB } from '@influxdata/influxdb-client';
import { PingAPI } from '@influxdata/influxdb-client-apis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InfluxRepository {
  async connection(url: string, token: string) {
    const influxClient = new InfluxDB({
      url,
      token,
    });

    const ping = new PingAPI(influxClient);

    return ping
      .getPing()
      .then(() => {
        return influxClient;
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
