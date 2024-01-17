import { InfluxDB } from '@influxdata/influxdb-client';
import { Injectable } from '@nestjs/common';

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

@Injectable()
export class EnergyService {
  async findEnergy({
    field,
    devsIds,
    begin,
    end,
    group,
    urlDb,
    tokenDb,
    bucket,
  }: EnergyByGroupProps): Promise<EnergyResult[]> {
    const client = new InfluxDB({ url: urlDb, token: tokenDb });

    const queryApi = client.getQueryApi('fox-iot');

    const query = `
      firsts = from(bucket: "${bucket}")
        |> range(start: ${begin}, stop: ${end})
        |> filter(fn: (r) => r._field == "${field}")
        |> filter(fn: (r) => ${devsIds
          .map((id) => `r.dev_id == "${id}"`)
          .join(' or ')})
        |> aggregateWindow(every: ${group}, fn: first, createEmpty: false)
        |> sort(columns: ["_time"])
        |> set(key: "_field", value: "firsts")
        |> drop(columns:["_start", "_stop", "_measurement"])
        |> yield(name: "first")

      lasts = from(bucket: "${bucket}")
        |> range(start: ${begin}, stop: ${end})
        |> filter(fn: (r) => r._field == "${field}")
        |> filter(fn: (r) => ${devsIds
          .map((id) => `r.dev_id == "${id}"`)
          .join(' or ')})
        |> aggregateWindow(every: ${group}, fn: last, createEmpty: false)
        |> sort(columns: ["_time"])
        |> set(key: "_field", value: "lasts")
        |> drop(columns:["_start", "_stop", "_measurement"])
        |> yield(name: "last")

      join(tables: {t1: lasts, t2: firsts}, on: ["_time", "dev_id"])
        |> map(fn: (r) => ({ _value: r._value_t1 - r._value_t2, dev_id: r.dev_id, _time: r._time }))`;

    const result = await queryApi.collectRows<EnergyResult>(query);

    if (!result) {
      throw new Error('Influx query not found');
    }

    return result;
  }

  async findEnergyTotal({
    field,
    devsIds,
    begin,
    end,
    urlDb,
    tokenDb,
    bucket,
  }: Omit<EnergyProps, 'begin' | 'end'> & {
    begin: number;
    end: number;
  }): Promise<EnergyResult[]> {
    const client = new InfluxDB({ url: urlDb, token: tokenDb });

    const queryApi = client.getQueryApi('fox-iot');

    const query = `
      firsts = from(bucket: "${bucket}")
          |> range(start: ${begin}, stop: ${end})
          |> first(column: "_value")
          |> filter(fn: (r) => r["_field"] == "${field}")
          |> filter(fn: (r) => ${devsIds
            .map((id) => `r.dev_id == "${id}"`)
            .join(' or ')})
          |> sort(columns: ["_time"])
          |> set(key: "_field", value: "firsts")
          |> drop(columns:["_start", "_stop", "_measurement"])
          |> yield(name: "first")

      lasts = from(bucket: "${bucket}")
          |> range(start: ${begin}, stop: ${end})
          |> last(column: "_value")
          |> filter(fn: (r) => r._field == "${field}")
          |> filter(fn: (r) => ${devsIds
            .map((id) => `r.dev_id == "${id}"`)
            .join(' or ')})
          |> sort(columns: ["_time"])
          |> set(key: "_field", value: "lasts")
          |> drop(columns:["_start", "_stop", "_measurement"])
          |> yield(name: "last")

      join(tables: {t1: lasts, t2: firsts}, on: ["dev_id"])
          |> map(fn: (r) => ({ _value: r._value_t1 - r._value_t2, dev_id: r.dev_id, _time: r._time }))`;

    const result = await queryApi.collectRows<EnergyResult>(query);

    if (!result) {
      throw new Error('Influx query not found');
    }

    return result;
  }

  async findEnergyPrediction({
    field,
    devsIds,
    begin,
    end,
    group,
    urlDb,
    tokenDb,
    bucket,
  }: EnergyByGroupProps): Promise<EnergyResult[]> {
    const client = new InfluxDB({ url: urlDb, token: tokenDb });

    const queryApi = client.getQueryApi('fox-iot');

    const query = `from(bucket: "${bucket}")
        |> range(start: ${begin}, stop: ${end})
        |> filter(fn: (r) => r._field == "${field}")
        |> filter(fn: (r) => ${devsIds
          .map((id) => `r.dev_id == "${id}"`)
          .join(' or ')})
        |> sort(columns: ["_time"])
        |> drop(columns:["_start", "_stop", "_measurement"])
        |> aggregateWindow(every: ${group}, fn: mean, createEmpty: false)
        |> yield(name: "mean")`;

    const result = await queryApi.collectRows<EnergyResult>(query);

    if (!result) {
      throw new Error('Influx query not found');
    }

    return result;
  }

  async findEnergyPredictionTotal({
    field,
    devsIds,
    begin,
    end,
    urlDb,
    tokenDb,
    bucket,
  }: EnergyProps): Promise<EnergyResult[]> {
    const client = new InfluxDB({ url: urlDb, token: tokenDb });

    const queryApi = client.getQueryApi('fox-iot');

    const query = `
      from(bucket: "${bucket}")
          |> range(start: ${begin}, stop: ${end})
          |> filter(fn: (r) => r._field == "${field}")
          |> filter(fn: (r) => ${devsIds
            .map((id) => `r.dev_id == "${id}"`)
            .join(' or ')})
          |> sort(columns: ["_time"])
          |> drop(columns:["_start", "_stop", "_measurement"])
          |> sum()`;

    const result = await queryApi.collectRows<EnergyResult>(query);

    if (!result) {
      throw new Error('Influx query not found');
    }

    return result;
  }
}
