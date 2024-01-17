type ISOString = string;

export class GenerateCSVQuality {
  nameFile: string;
  ucCodes: string[];
  dateRange: {
    startDate: ISOString;
    endDate: ISOString;
  };
  fields: string[];
}
