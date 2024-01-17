import { DashboardQualityDto } from '../dto/dashboardQuality.dto';
declare const queryDashboardQuality: ({ devsIds, bucket, startDate, endDate, }: DashboardQualityDto) => string;
export default queryDashboardQuality;
