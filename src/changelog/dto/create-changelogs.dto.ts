import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateChangelogDto {
  @IsString()
  @ApiProperty()
  version: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  date?: Date;
}
