import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CreateDevicesGaDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  devId: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  clientId: Types.ObjectId;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  authenticated?: boolean;

  @ApiPropertyOptional()
  online?: boolean;
}
