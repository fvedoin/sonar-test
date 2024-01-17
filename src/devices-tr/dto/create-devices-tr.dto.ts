import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDevicesTrDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ type: String })
  clientId: Types.ObjectId | string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ type: String })
  databaseId: Types.ObjectId | string;

  @ApiProperty()
  devId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @IsMongoId()
  @ApiPropertyOptional()
  applicationId?: Types.ObjectId | string;

  @IsMongoId()
  @ApiPropertyOptional()
  bucketId?: Types.ObjectId | string;

  @IsMongoId()
  @ApiPropertyOptional()
  mqttApplicationId?: Types.ObjectId | string;

  @ApiPropertyOptional()
  topics?: string[];

  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  password?: string;
}
