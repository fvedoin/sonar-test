import { GenerateCSV } from '../dto/generate-csv.dto';
export declare const generateCSVStubs: (dateRange?: {
    startDate: string;
    endDate: string;
}, ucsCodes?: string[]) => GenerateCSV;
