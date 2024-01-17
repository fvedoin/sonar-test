import { FindQualityDto } from '../dto/findQuality.dto';
declare const queryFindQuality: ({ fields, devsIds, begin, end, bucket, }: FindQualityDto) => string;
export default queryFindQuality;
