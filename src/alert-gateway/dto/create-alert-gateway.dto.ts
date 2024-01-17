import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateAlertGatewayDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ type: String })
  clientId: Types.ObjectId | string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ type: String, isArray: true })
  emails: string[];

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number })
  interval: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  status: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String })
  ttnId: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ type: Boolean })
  enabled: boolean;
}
