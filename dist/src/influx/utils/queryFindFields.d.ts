import { FindFieldsDto } from '../dto/findFields.dto';
declare const queryFindFields: ({ fields, devsIds, begin, end, bucket, aggregation, }: FindFieldsDto) => string;
export default queryFindFields;
