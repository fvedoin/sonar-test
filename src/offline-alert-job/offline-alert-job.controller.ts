import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OfflineAlertJobService } from './offline-alert-job.service';
import { CreateOfflineAlertJobDto } from './dto/create-offline-alert-job.dto';
import { UpdateOfflineAlertJobDto } from './dto/update-offline-alert-job.dto';

@Controller('offline-alert-job')
export class OfflineAlertJobController {
  constructor(
    private readonly offlineAlertJobService: OfflineAlertJobService,
  ) {}

  @Post()
  create(@Body() createOfflineAlertJobDto: CreateOfflineAlertJobDto) {
    return this.offlineAlertJobService.create(createOfflineAlertJobDto);
  }

  @Get()
  findAll() {
    return this.offlineAlertJobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offlineAlertJobService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOfflineAlertJobDto: UpdateOfflineAlertJobDto,
  ) {
    return this.offlineAlertJobService.update(+id, updateOfflineAlertJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offlineAlertJobService.remove(+id);
  }
}
