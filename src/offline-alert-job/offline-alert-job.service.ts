import { Injectable } from '@nestjs/common';
import { CreateOfflineAlertJobDto } from './dto/create-offline-alert-job.dto';
import { UpdateOfflineAlertJobDto } from './dto/update-offline-alert-job.dto';

@Injectable()
export class OfflineAlertJobService {
  create(createOfflineAlertJobDto: CreateOfflineAlertJobDto) {
    return 'This action adds a new offlineAlertJob';
  }

  findAll() {
    return `This action returns all offlineAlertJob`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offlineAlertJob`;
  }

  update(id: number, updateOfflineAlertJobDto: UpdateOfflineAlertJobDto) {
    return `This action updates a #${id} offlineAlertJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} offlineAlertJob`;
  }
}
