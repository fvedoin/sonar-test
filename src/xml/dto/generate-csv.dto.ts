type ISOString = string;

export class GenerateCSV {
  nameFile: string;
  ucCodes: string[];
  dateRange: {
    startDate: ISOString;
    endDate: ISOString;
  };
  fields: string[];
  aggregation: string;
}
