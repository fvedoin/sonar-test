import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';

export class CreateSettingDto {
  @IsMongoId()
  @ApiProperty({ type: String })
  clientId: Types.ObjectId | string | Client;

  @IsNumber()
  @ApiProperty()
  offlineTime: number;

  @IsNumber()
  @ApiProperty()
  peakHourStart: number;

  @IsNumber()
  @ApiProperty()
  peakHourEnd: number;

  @IsString()
  @ApiProperty()
  precariousVoltageAbove: string;

  @IsString()
  @ApiProperty()
  precariousVoltageBelow: string;

  @IsString()
  @ApiProperty()
  criticalVoltageAbove: string;

  @IsString()
  @ApiProperty()
  criticalVoltageBelow: string;
}
