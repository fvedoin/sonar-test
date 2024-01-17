import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUcdisabledHistoryDto {
  @IsMongoId()
  @ApiProperty()
  clientId: Types.ObjectId;

  @IsMongoId()
  @ApiProperty()
  ucId: Types.ObjectId;

  @ApiProperty()
  date: Date;

  @IsMongoId()
  @ApiProperty()
  deviceId: Types.ObjectId;

  @IsBoolean()
  @ApiProperty()
  dataDeleted: boolean;

  @IsMongoId()
  @ApiProperty()
  userId: Types.ObjectId;
}
