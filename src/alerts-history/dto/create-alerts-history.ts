import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAlertHistoryDto {
  @IsString()
  @ApiProperty()
  alertType: string;

  @IsString()
  @ApiProperty()
  alertName: string;

  @IsString()
  @ApiProperty()
  alertAllows: string;

  @IsString()
  @ApiProperty()
  alertVariables: string;

  @IsString()
  @ApiProperty()
  alertValue: string;

  @IsString()
  @ApiProperty()
  operator: string;

  @ApiProperty({ type: String, isArray: true })
  sentEmail: string[];

  @ApiProperty()
  alertTime: Date;

  @IsMongoId()
  @ApiProperty({ type: String })
  clientId: Types.ObjectId | string;
}
