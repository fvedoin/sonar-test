import { FindFaultsDto } from '../dto/FindFaults.dto';

const findDrpDrcByUcAndPeriod = ({
  devsIds,
  begin,
  end,
  bucket,
}: FindFaultsDto) => {
  return `from(bucket: "${bucket}")
        |> range(start: ${begin}, stop: ${end})
        |> filter(fn: (r) => r["_measurement"] == "payload")
        |> filter(fn: (r) => r["_field"] == "energy_fall_time" or r["_field"] == "counter_fall" or r["_field"] == "energy_return_time" or r["_field"] == "counter_return")
        |> filter(fn: (r) => ${devsIds})
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> drop(columns:["_value", "_start", "_stop", "_measurement"])
        |> filter(fn: (r) => r["energy_fall_time"] > ${begin} and r["energy_fall_time"] < ${end})
        |> group(columns: ["dev_id", "energy_fall_time"], mode: "by")
        |> sort(columns: ["_time"])
        |> first(column: "_time")`;
};

export default findDrpDrcByUcAndPeriod;
