import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  appId: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsMongoId()
  @ApiProperty()
  clientId: string;
}
