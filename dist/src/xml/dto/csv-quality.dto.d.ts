import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { GenerateCSVQuality } from './generate-csv-quality.dto';
export declare class CSVQuality extends GenerateCSVQuality {
    user: UserFromJwt;
}
