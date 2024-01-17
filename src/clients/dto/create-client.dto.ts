import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

import { CNPJValidator } from '../validators/cnpj.validator';
import { Types } from 'mongoose';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  initials: string;

  @Validate(CNPJValidator)
  @ApiProperty()
  cnpj: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  aneelcode?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  local: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  address: string;

  @IsArray()
  @ApiProperty()
  modules: string[];

  @IsOptional()
  @IsMongoId()
  @ApiProperty()
  parentId?: Types.ObjectId | string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  active?: boolean;
}
