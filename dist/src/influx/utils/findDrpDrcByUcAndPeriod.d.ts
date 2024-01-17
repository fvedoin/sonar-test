import { FindFaultsDto } from '../dto/FindFaults.dto';
declare const findDrpDrcByUcAndPeriod: ({ devsIds, begin, end, bucket, }: FindFaultsDto) => string;
export default findDrpDrcByUcAndPeriod;
