import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/Role';
import { ClientsService } from 'src/clients/clients.service';

import { CreateInfluxBucketDto } from './dto/create-influx-bucket.dto';
import { UpdateInfluxBucketDto } from './dto/update-influx-bucket.dto';
import { InfluxBucketsService } from './influx-buckets.service';

@ApiTags('Buckets InfluxDB')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN)
@UseGuards(RolesGuard)
@Controller('influx-buckets')
export class InfluxBucketsController {
  constructor(
    private readonly influxBucketsService: InfluxBucketsService,
    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
  ) {}

  @Post()
  async create(@Body() createInfluxBucketDto: CreateInfluxBucketDto) {
    const { alias, influxConnectionId, clientId, product } =
      createInfluxBucketDto;

    const client = await this.clientsService.findOne(clientId);

    const searchRegExp = /\s/g;

    const bucket = {
      influxConnectionId,
      clientId,
      alias,
      product,
      name: `${client.name}-${product}`
        .replace(searchRegExp, '-')
        .toLowerCase(),
    };

    return this.influxBucketsService.create(bucket);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.influxBucketsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInfluxBucketDto: UpdateInfluxBucketDto,
  ) {
    return this.influxBucketsService.update(id, updateInfluxBucketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.influxBucketsService.remove(id);
  }
}
