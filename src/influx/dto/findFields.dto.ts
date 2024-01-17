export class FindFieldsDto {
  fields?: string;
  devsIds: string;
  begin: number;
  end: number;
  bucket: string;
  aggregation: string;
  communication?: string;
}
