"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryConsume = ({ devId, bucket, start, stop }) => {
    return `
  first = from(bucket: "${bucket}")
          |> range(start: ${start}, stop: ${stop})
          |> filter(fn: (r) => r["_measurement"] == "payload")
          |> filter(fn: (r) => r["_field"] == "consumed_total_energy")
          |> filter(fn: (r) => r["dev_id"] == "${devId}")
          |> first(column: "_value")
          |> sort(columns: ["_time"])
          |> set(key: "_field", value: "first")
          |> drop(columns:["_start", "_stop", "_measurement"])
          |> yield(name: "firstCurrentMonth")

  last = from(bucket: "${bucket}")
          |> range(start: ${start}, stop: ${stop})
          |> filter(fn: (r) => r["_measurement"] == "payload")
          |> filter(fn: (r) => r["_field"] == "consumed_total_energy")
          |> filter(fn: (r) => r["dev_id"] == "${devId}")
          |> last(column: "_value")
          |> sort(columns: ["_time"])
          |> set(key: "_field", value: "last")
          |> drop(columns:["_start", "_stop", "_measurement"])
          |> yield(name: "lastCurrentMonth")

  join(tables: {t1: last, t2: first}, on: ["dev_id"])
          |> map(fn: (r) => ({ _value: r._value_t1 - r._value_t2, dev_id: r.dev_id, _time: r._time }))
  `;
};
exports.default = queryConsume;
//# sourceMappingURL=queryConsume.js.map