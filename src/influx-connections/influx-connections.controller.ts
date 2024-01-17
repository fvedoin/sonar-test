import { InfluxDB } from '@influxdata/influxdb-client';
import { PingAPI } from '@influxdata/influxdb-client-apis';
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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';
import { InfluxBucketsService } from 'src/influx-buckets/influx-buckets.service';

import { CreateInfluxConnectionDto } from './dto/create-influx-connection.dto';
import { PingInfluxConnectionDto } from './dto/ping-influx-connection.dto';
import { UpdateInfluxConnectionDto } from './dto/update-influx-connection.dto';
import { InfluxConnectionsService } from './influx-connections.service';

@ApiTags('Conexões InfluxDB')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN)
@UseGuards(RolesGuard)
@Controller('influx-connections')
export class InfluxConnectionsController {
  constructor(
    private readonly influxConnectionsService: InfluxConnectionsService,
    private readonly influxBucketsService: InfluxBucketsService,
  ) {}

  @Post()
  create(@Body() createInfluxConnectionDto: CreateInfluxConnectionDto) {
    return this.influxConnectionsService.create(createInfluxConnectionDto);
  }

  @Post('ping')
  async ping(@Body() pingInfluxConnectionDto: PingInfluxConnectionDto) {
    const timeout = 10 * 1000; // timeout for ping
    const influxDB = new InfluxDB({
      url: pingInfluxConnectionDto.host,
      timeout,
    });

    const pingAPI = new PingAPI(influxDB);
    return await pingAPI.getPing();
  }

  @Get()
  @Roles(Role.VIEWER, Role.SUPPORT, Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN)
  findAll() {
    return this.influxConnectionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.influxConnectionsService.findOne(id);
  }

  @Get(':id/buckets')
  findBuckets(@Param('id') id: string) {
    return this.influxBucketsService.findByInfluxConnection(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInfluxConnectionDto: UpdateInfluxConnectionDto,
  ) {
    return await this.influxConnectionsService.update(
      id,
      updateInfluxConnectionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.influxConnectionsService.remove(id);
  }
}
