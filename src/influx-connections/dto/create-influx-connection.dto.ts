import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateInfluxConnectionDto {
  @IsString()
  @ApiProperty()
  alias: string;

  @IsString()
  @ApiProperty()
  host: string;

  @IsString()
  @ApiProperty()
  apiToken: string;

  @IsString()
  @ApiProperty()
  orgId: string;
}
