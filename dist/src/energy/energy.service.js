"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyService = void 0;
const influxdb_client_1 = require("@influxdata/influxdb-client");
const common_1 = require("@nestjs/common");
let EnergyService = class EnergyService {
    async findEnergy({ field, devsIds, begin, end, group, urlDb, tokenDb, bucket, }) {
        const client = new influxdb_client_1.InfluxDB({ url: urlDb, token: tokenDb });
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
        const result = await queryApi.collectRows(query);
        if (!result) {
            throw new Error('Influx query not found');
        }
        return result;
    }
    async findEnergyTotal({ field, devsIds, begin, end, urlDb, tokenDb, bucket, }) {
        const client = new influxdb_client_1.InfluxDB({ url: urlDb, token: tokenDb });
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
        const result = await queryApi.collectRows(query);
        if (!result) {
            throw new Error('Influx query not found');
        }
        return result;
    }
    async findEnergyPrediction({ field, devsIds, begin, end, group, urlDb, tokenDb, bucket, }) {
        const client = new influxdb_client_1.InfluxDB({ url: urlDb, token: tokenDb });
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
        const result = await queryApi.collectRows(query);
        if (!result) {
            throw new Error('Influx query not found');
        }
        return result;
    }
    async findEnergyPredictionTotal({ field, devsIds, begin, end, urlDb, tokenDb, bucket, }) {
        const client = new influxdb_client_1.InfluxDB({ url: urlDb, token: tokenDb });
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
        const result = await queryApi.collectRows(query);
        if (!result) {
            throw new Error('Influx query not found');
        }
        return result;
    }
};
EnergyService = __decorate([
    (0, common_1.Injectable)()
], EnergyService);
exports.EnergyService = EnergyService;
//# sourceMappingURL=energy.service.js.map