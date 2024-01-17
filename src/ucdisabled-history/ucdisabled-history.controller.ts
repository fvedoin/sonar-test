import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UcdisabledHistoryService } from './ucdisabled-history.service';
import { CreateUcdisabledHistoryDto } from './dto/create-ucdisabled-history.dto';
import { FindUcDisableHistoryDto } from './dto/find-ucdisabled-history.dto';
import { ClientSession } from 'mongoose';
import { Role } from 'src/auth/models/Role';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('ucdisabled-history')
export class UcdisabledHistoryController {
  constructor(
    private readonly ucdisabledHistoryService: UcdisabledHistoryService,
  ) {}

  @Post()
  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  async create(
    @Body() createUcdisabledHistoryDto: CreateUcdisabledHistoryDto,
    session: ClientSession,
  ) {
    try {
      return this.ucdisabledHistoryService.create(
        createUcdisabledHistoryDto,
        session,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Erro ao criar histórico de UCs desativadas.',
          stacktrace: error.message,
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Get()
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  findAll(@Query() query: FindUcDisableHistoryDto) {
    try {
      return this.ucdisabledHistoryService.findAll(query);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Não foi possível buscar o histórico de UCs desativadas.',
          stacktrace: error.message,
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }
}
