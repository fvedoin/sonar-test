import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryFindAllDto {
  @ApiPropertyOptional()
  clientId: string;

  @ApiPropertyOptional()
  deviceType: 'LoRa' | 'GSM';

  @ApiPropertyOptional()
  allows: string;

  @ApiPropertyOptional()
  transformerId: string;
}

export class QueryFindAllPaginateDto {
  @ApiPropertyOptional()
  sort?: string;

  @ApiPropertyOptional()
  skip?: string;

  @ApiPropertyOptional()
  limit?: string;

  @ApiPropertyOptional()
  searchText?: string;

  @ApiPropertyOptional()
  filter?: { [key: string | number]: unknown | string }[];

  @ApiPropertyOptional()
  fieldMask?: string;

  clientId?: string;
}
