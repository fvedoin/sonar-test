import { QueryGetAllDataByDevId } from '../dto/GetAllData.dto';

const queryGetAllDataByDevId = ({
  bucketName,
  devId,
}: QueryGetAllDataByDevId) => {
  return `
    from(bucket:"${bucketName}")
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == "payload")
      |> filter(fn: (r) => r["dev_id"] == "${devId}")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> drop(columns:["_value", "_start", "_stop", "_measurement", "table", "result"])
    `;
};

export default queryGetAllDataByDevId;
