import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsMongoId,
  IsPhoneNumber,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsPhoneNumber('BR')
  @ApiProperty()
  phone?: string;

  @IsString()
  @ApiProperty()
  accessLevel: string;

  @IsMongoId()
  @ApiProperty()
  clientId: string;

  @IsString()
  @ApiProperty()
  password: string;

  @ArrayNotEmpty()
  @IsArray()
  @ApiProperty()
  modules: string[];

  @IsNumber()
  @ApiProperty()
  attempts?: number;
}
