import { FindQualityDto } from '../dto/findQuality.dto';

const queryFindQuality = ({
  fields,
  devsIds,
  begin,
  end,
  bucket,
}: FindQualityDto) => {
  return `from(bucket: "${bucket}")
  |> range(start: ${begin}, stop: ${end})
  |> filter(fn: (r) => r["_measurement"] == "payload")
  |> filter(fn: (r) => ${fields}
      or r["_field"] == "quality_interval_start"
      or r["_field"] == "quality_interval_end")
  |> filter(fn: (r) => ${devsIds})
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> drop(columns:["_value", "_start", "_stop", "_measurement"])
  |> filter(fn: (r) => r["quality_interval_end"] > ${begin} and r["quality_interval_end"] < ${end})
  |> group(columns: ["dev_id", "quality_interval_start", "quality_interval_end"], mode: "by")
  |> sort(columns: ["_time"])
  |> first(column: "_time")`;
};

export default queryFindQuality;
