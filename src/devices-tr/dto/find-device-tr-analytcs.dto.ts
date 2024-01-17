import { ApiProperty } from '@nestjs/swagger';

export class FindDeviceTrAnalyticsDto {
  @ApiProperty()
  dateRange: {
    startDate: string;
    endDate: string;
  };

  @ApiProperty()
  fields: string[];

  @ApiProperty()
  trsIds: string[];
}
