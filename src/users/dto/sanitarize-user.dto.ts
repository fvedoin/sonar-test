import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class SanitizeUser {
  @IsString()
  _id: string;

  @IsString()
  accessLevel: string;

  @IsBoolean()
  active: boolean;

  @IsBoolean()
  blocked: boolean;

  @IsString()
  clientId: string;

  @IsString()
  phone: string;

  @IsDate()
  createdAt: Date;

  @IsOptional() // O campo é opcional
  @IsUrl() // Verifica se é uma URL válida
  image: string | null;

  @IsArray()
  modules: string[];

  @IsString()
  name: string;

  @IsString()
  username: string;
}
