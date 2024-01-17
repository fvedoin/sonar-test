import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindDevicesTrDto {
  @ApiPropertyOptional()
  clientId: string;
}
