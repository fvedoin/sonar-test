import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateChangelogDto {
  @IsString()
  @ApiProperty()
  version: string;

  @IsString()
  @ApiProperty()
  description: string;
}
