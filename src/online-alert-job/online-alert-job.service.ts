import { Injectable } from '@nestjs/common';
import { CreateOnlineAlertJobDto } from './dto/create-online-alert-job.dto';
import { UpdateOnlineAlertJobDto } from './dto/update-online-alert-job.dto';

@Injectable()
export class OnlineAlertJobService {
  create(createOnlineAlertJobDto: CreateOnlineAlertJobDto) {
    return 'This action adds a new onlineAlertJob';
  }

  findAll() {
    return `This action returns all onlineAlertJob`;
  }

  findOne(id: number) {
    return `This action returns a #${id} onlineAlertJob`;
  }

  update(id: number, updateOnlineAlertJobDto: UpdateOnlineAlertJobDto) {
    return `This action updates a #${id} onlineAlertJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} onlineAlertJob`;
  }
}
