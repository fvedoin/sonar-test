import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindSettingDto {
  @ApiPropertyOptional()
  clientId: string;

  @ApiPropertyOptional()
  sort: string;

  @ApiPropertyOptional()
  skip: string;

  @ApiPropertyOptional()
  limit: string;

  @ApiPropertyOptional()
  searchText: string;

  @ApiPropertyOptional()
  filter: { [key: string | number]: unknown }[];

  @ApiPropertyOptional()
  fieldMask: string;
}
