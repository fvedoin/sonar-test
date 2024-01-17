import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PingInfluxConnectionDto {
  @IsString()
  @ApiProperty()
  host: string;
}
