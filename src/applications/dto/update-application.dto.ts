import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

import { CreateApplicationDto } from './create-application.dto';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsMongoId()
  @ApiProperty()
  clientId: string;
}
