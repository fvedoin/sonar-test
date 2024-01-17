import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateApiAccessControlDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsBoolean()
  @ApiProperty()
  active: boolean;

  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsNumber()
  @ApiProperty()
  limitRate: number;
}
