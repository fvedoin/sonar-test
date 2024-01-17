import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMqttAccessDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  devId: string;

  @ApiPropertyOptional()
  isSuperUser?: boolean;

  @ApiProperty()
  encryptedPassword: string;

  @ApiPropertyOptional()
  permission?: string;

  @ApiPropertyOptional()
  action?: string;

  @ApiProperty()
  topics: string[];

  @ApiProperty()
  type: string;
}
