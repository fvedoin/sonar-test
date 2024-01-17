import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
export class CreateUcDto {
  @IsMongoId()
  @IsOptional()
  @ApiProperty()
  clientId: string | undefined;
  @IsMongoId()
  @ApiProperty()
  transformerId: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty()
  deviceId: string | undefined;

  @IsNumber()
  @ApiProperty()
  billingGroup: number;

  @IsNumber()
  @ApiProperty()
  routeCode: number;

  @IsNumber()
  @ApiProperty()
  ratedVoltage: number;

  @IsString()
  @ApiProperty()
  ucCode: string;

  @IsString()
  @ApiProperty()
  ucNumber: string;

  @IsString()
  @ApiProperty()
  @IsEnum([
    'COMERCIAL',
    'CONSUMO PRÓPRIO',
    'ILUMINAÇÃO PÚBLICA',
    'INDUSTRIAL',
    'PODERES PÚBLICOS',
    'RESIDENCIAL',
    'RURAL',
    'SERVIÇO PÚBLICO',
  ])
  ucClass: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  subClass: string | undefined;

  @IsString()
  @IsEnum(['A', 'B'])
  @ApiProperty()
  group: string;

  @IsString()
  @IsEnum(['A4', 'A4a', 'B1', 'B1r', 'B2', 'B3', 'B4a', 'B4b'])
  @ApiProperty()
  subGroup: string;

  @IsString()
  @ApiProperty()
  sequence: string;

  @IsString()
  @IsEnum(['A', 'B', 'C', 'AB', 'AC', 'BC', 'ABC'])
  @ApiProperty()
  phases: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  circuitBreaker: number;

  @IsBoolean()
  @ApiProperty()
  microgeneration: boolean;

  @IsString()
  @ApiProperty()
  city: string;

  @IsString()
  @ApiProperty()
  district: string;

  @IsNumber()
  @ApiProperty()
  latitude: number;

  @IsNumber()
  @ApiProperty()
  longitude: number;
}
