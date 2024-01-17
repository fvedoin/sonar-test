import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';

import { CreateMqttAccessDto } from './dto/create-mqtt-access.dto';
import { UpdateMqttAccessDto } from './dto/update-mqtt-access.dto';
import { MqttAccessService } from './mqtt-access.service';

@ApiTags('MqttAccess')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN)
@UseGuards(RolesGuard)
@Controller('mqtt-access')
export class MqttAccessController {
  constructor(private readonly mqttAccessService: MqttAccessService) {}

  @Post()
  async create(@Body() createMqttAccessDto: CreateMqttAccessDto) {
    return this.mqttAccessService.create({
      ...createMqttAccessDto,
      encryptedPassword: await bcrypt.hash(
        createMqttAccessDto.encryptedPassword,
        10,
      ),
    });
  }

  @Get()
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  findAll() {
    return this.mqttAccessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mqttAccessService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMqttAccessDto: UpdateMqttAccessDto,
  ) {
    return this.mqttAccessService.update(id, updateMqttAccessDto);
  }

  @Patch('clear-status')
  clearStatus() {
    return this.mqttAccessService.clearStatus();
  }

  @Patch('connect')
  connect(@Body('devId') devId: string) {
    return this.mqttAccessService.connect(devId);
  }

  @Patch('disconnect')
  disconnect(@Body('devId') devId: string) {
    return this.mqttAccessService.disconnect(devId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mqttAccessService.remove(id);
  }
}
