import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateInfluxBucketDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  alias: string;

  @IsString()
  @ApiProperty()
  product: string;

  @IsMongoId()
  @ApiProperty()
  influxConnectionId: string;

  @IsMongoId()
  @ApiProperty()
  clientId: string;
}
