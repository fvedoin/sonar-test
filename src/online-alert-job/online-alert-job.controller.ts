import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OnlineAlertJobService } from './online-alert-job.service';
import { CreateOnlineAlertJobDto } from './dto/create-online-alert-job.dto';
import { UpdateOnlineAlertJobDto } from './dto/update-online-alert-job.dto';

@Controller('online-alert-job')
export class OnlineAlertJobController {
  constructor(private readonly onlineAlertJobService: OnlineAlertJobService) {}

  @Post()
  create(@Body() createOnlineAlertJobDto: CreateOnlineAlertJobDto) {
    return this.onlineAlertJobService.create(createOnlineAlertJobDto);
  }

  @Get()
  findAll() {
    return this.onlineAlertJobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.onlineAlertJobService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOnlineAlertJobDto: UpdateOnlineAlertJobDto,
  ) {
    return this.onlineAlertJobService.update(+id, updateOnlineAlertJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.onlineAlertJobService.remove(+id);
  }
}
