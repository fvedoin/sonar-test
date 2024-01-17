import { GenerateCSV } from '../dto/generate-csv.dto';

export const generateCSVStubs = (
  dateRange?: {
    startDate: string;
    endDate: string;
  },
  ucsCodes?: string[],
): GenerateCSV => ({
  nameFile: 'teste',
  ucCodes: ucsCodes || ['10249'],
  dateRange: dateRange || {
    startDate: new Date(1672935579000).toISOString(),
    endDate: new Date(1680145199999).toISOString(),
  },
  aggregation: '30m',
  fields: [
    'current_phase_a',
    'current_phase_c',
    'consumed_total_energy',
    'generated_total_energy',
    'frequency',
  ],
});
