import { FindFieldsDto } from '../dto/findFields.dto';
declare const queryFindCommunication: ({ communication, devsIds, begin, end, bucket, aggregation, }: FindFieldsDto) => string;
export default queryFindCommunication;
