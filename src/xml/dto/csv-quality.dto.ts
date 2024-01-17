import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { GenerateCSVQuality } from './generate-csv-quality.dto';

export class CSVQuality extends GenerateCSVQuality {
  user: UserFromJwt;
}
