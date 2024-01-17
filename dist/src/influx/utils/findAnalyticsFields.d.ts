import { FindAnalyticsFields } from '../dto/FindAnalyticsFields.dto';
declare const findAnalyticsFields: ({ fields, devsIds, begin, end, bucket, }: FindAnalyticsFields) => string;
export default findAnalyticsFields;
