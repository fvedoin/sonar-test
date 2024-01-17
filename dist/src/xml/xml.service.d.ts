import { EventEmitter2 } from '@nestjs/event-emitter';
import { UcsService } from 'src/ucs/ucs.service';
import { CSVQuality } from './dto/csv-quality.dto';
import { CSV } from './dto/csv.dto';
export declare class XmlService {
    private readonly ucsServices;
    private eventEmitter;
    constructor(ucsServices: UcsService, eventEmitter: EventEmitter2);
    generateCSVQuality(data: CSVQuality): Promise<void>;
    generateCSV(data: CSV): Promise<void>;
}
