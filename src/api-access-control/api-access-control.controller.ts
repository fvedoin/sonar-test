import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApiAccessControlService } from './api-access-control.service';
import { CreateApiAccessControlDto } from './dto/create-api-access-control.dto';
import { UpdateApiAccessControlDto } from './dto/update-api-access-control.dto';

@ApiTags('Api-Useall')
@Controller('api-access-control')
export class ApiAccessControlController {
  constructor(
    private readonly apiAccessControlService: ApiAccessControlService,
  ) {}

  @Post()
  @ApiBearerAuth()
  create(@Body() createApiAccessControlDto: CreateApiAccessControlDto) {
    return this.apiAccessControlService.create(createApiAccessControlDto);
  }

  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.apiAccessControlService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.apiAccessControlService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateApiAccessControlDto: UpdateApiAccessControlDto,
  ) {
    return this.apiAccessControlService.update(id, updateApiAccessControlDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.apiAccessControlService.remove(id);
  }
}
