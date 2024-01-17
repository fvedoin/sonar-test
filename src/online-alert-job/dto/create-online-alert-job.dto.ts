import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsMongoId } from 'class-validator';
export class CreateOnlineAlertJobDto {
  @IsDate()
  @ApiProperty()
  triggerAt: Date;

  @IsMongoId()
  @ApiProperty()
  alertId: string;

  @IsMongoId()
  @ApiProperty()
  deviceId: string;

  @IsDate()
  @ApiProperty()
  createdAt: Date;
}
