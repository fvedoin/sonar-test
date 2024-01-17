import { FindFieldsDto } from '../dto/findFields.dto';

const queryFindCommunication = ({
  communication,
  devsIds,
  begin,
  end,
  bucket,
  aggregation,
}: FindFieldsDto) => {
  return `from(bucket: "${bucket}")
  |> range(start: ${begin}, stop: ${end})
  |> filter(fn: (r) => r["_measurement"] == "signal")
  |> filter(fn: (r) => ${communication})
  |> filter(fn: (r) => ${devsIds})
  |> aggregateWindow(every: ${aggregation}, fn: mean, createEmpty: false)
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
  |> drop(columns:["_value", "_start", "_stop", "_measurement"])
  |> group(columns: ["dev_id"], mode: "by")
  |> sort(columns: ["_time"])`;
};

export default queryFindCommunication;
