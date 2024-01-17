import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

interface ReceivedPoint {
  lat: number;
  lng: number;
}

export class CreateAreaDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty({ type: String })
  clientId: Types.ObjectId | string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ default: [{ type: 'Point', coordinates: [0, 0] }] })
  points: ReceivedPoint[];
}
