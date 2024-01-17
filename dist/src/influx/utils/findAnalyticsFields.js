"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findAnalyticsFields = ({ fields, devsIds, begin, end, bucket, }) => {
    const query = `from(bucket: "${bucket}")
        |> range(start: ${begin}, stop: ${end})
        |> filter(fn: (r) => r["_measurement"] == "payload")
        |> filter(fn: (r) => ${fields})
        |> filter(fn: (r) => ${devsIds})
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> drop(columns:["_value", "_start", "_stop", "_measurement"])
        |> group(columns: ["dev_id"], mode: "by")
        |> sort(columns: ["_time"])`;
    return query;
};
exports.default = findAnalyticsFields;
//# sourceMappingURL=findAnalyticsFields.js.map