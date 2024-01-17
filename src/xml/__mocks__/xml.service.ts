import { resultCSVQualityStubs } from '../stubs/resultCSVQuality.stubs';
import { resultCSVStubs } from '../stubs/resultCSV.stubs';

export const XmlService = jest.fn().mockReturnValue({
  generateCSVQuality: jest.fn().mockResolvedValue(resultCSVQualityStubs()),
  generateCSV: jest.fn().mockResolvedValue(resultCSVStubs()),
});
