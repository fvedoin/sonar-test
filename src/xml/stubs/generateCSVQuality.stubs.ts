import { GenerateCSVQuality } from '../dto/generate-csv-quality.dto';

export const generateCSVQualityStubs = (): GenerateCSVQuality => ({
  nameFile: 'teste',
  ucCodes: ['10249'],
  dateRange: {
    startDate: new Date(1662394779000).toISOString(),
    endDate: new Date(1667665179000).toISOString(),
  },
  fields: [
    'drp_phase_a',
    'drp_phase_b',
    'drp_phase_c',
    'drc_phase_a',
    'drc_phase_b',
    'drc_phase_c',
  ],
});
