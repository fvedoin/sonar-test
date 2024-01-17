"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryVoltage = (bucket, devId) => `
from(bucket: "${bucket}")
    |> range(start: -1h, stop: now())
    |> filter(fn: (r) => r["_measurement"] == "payload")
    |> filter(fn: (r) => r["_field"] == "voltage_phase_b" or r["_field"] == "voltage_phase_a" or r["_field"] == "voltage_phase_c")
    |> filter(fn: (r) => r["dev_id"] == "${devId}")
    |> max()
    |> yield(name: "max")

from(bucket: "${bucket}")
        |> range(start: -1h, stop: now())
        |> filter(fn: (r) => r["_measurement"] == "payload")
        |> filter(fn: (r) => r["_field"] == "voltage_phase_b" or r["_field"] == "voltage_phase_a" or r["_field"] == "voltage_phase_c")
        |> filter(fn: (r) => r["dev_id"] == "${devId}")
        |> min()
        |> yield(name: "min")
`;
exports.default = queryVoltage;
//# sourceMappingURL=queryVoltage.js.map