import { XmlService } from './xml.service';
import { GenerateCSVQuality } from './dto/generate-csv-quality.dto';
import { GenerateCSV } from './dto/generate-csv.dto';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
export declare class XmlController {
    private readonly xmlService;
    constructor(xmlService: XmlService);
    generateCSVQuality(data: GenerateCSVQuality, user: UserFromJwt): Promise<void>;
    generateCSV(data: GenerateCSV, user: UserFromJwt): Promise<void>;
}
