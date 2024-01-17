import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { GenerateCSV } from './generate-csv.dto';

export class CSV extends GenerateCSV {
  user: UserFromJwt;
}
