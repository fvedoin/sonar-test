import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMeterChangeDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  clientId: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  ucCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lastConsumedOldMeter: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  firstConsumedNewMeter: number;

  @ApiProperty()
  @IsNotEmpty()
  changedAt: Date;

  @ApiProperty()
  @IsNumber()
  firstGeneratedNewMeter: number;

  @ApiProperty()
  @IsNumber()
  lastGeneratedOldMeter: number;
}
