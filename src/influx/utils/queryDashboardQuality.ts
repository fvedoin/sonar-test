import { DashboardQualityDto } from '../dto/dashboardQuality.dto';

const queryDashboardQuality = ({
  devsIds,
  bucket,
  startDate,
  endDate,
}: DashboardQualityDto) => {
  const devsIdsQuery = devsIds
    .map((devId) => {
      return `r["dev_id"] == "${devId}"`;
    })
    .join(' or ');

  return `
  from(bucket: "${bucket}")
    |> range(start: ${startDate}, stop: ${endDate})
    |> filter(fn: (r) => r["_measurement"] == "payload")
    |> filter(fn: (r) => r["_field"] == "drc_phase_b" or r["_field"] == "drc_phase_a" or r["_field"] == "drc_phase_c")
    |> filter(fn: (r) => ${devsIdsQuery})
    |> last()
    |> yield(name: "DRC")

  from(bucket: "${bucket}")
    |> range(start: ${startDate}, stop: ${endDate})
    |> filter(fn: (r) => r["_measurement"] == "payload")
    |> filter(fn: (r) => r["_field"] == "drp_phase_b" or r["_field"] == "drp_phase_a" or r["_field"] == "drp_phase_c")
    |> filter(fn: (r) => ${devsIdsQuery})
    |> last()
    |> yield(name: "DRP")
  `;
};

export default queryDashboardQuality;
