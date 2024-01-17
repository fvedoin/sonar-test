import { Module } from '@nestjs/common';
import { OfflineAlertJobService } from './offline-alert-job.service';
import { OfflineAlertJobController } from './offline-alert-job.controller';
import { OfflineAlertJobRepository } from './offline-alert-job.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OfflineAlertJob,
  OfflineAlertJobSchema,
} from './entities/offline-alert-job.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OfflineAlertJob.name, schema: OfflineAlertJobSchema },
    ]),
  ],
  controllers: [OfflineAlertJobController],
  providers: [OfflineAlertJobService, OfflineAlertJobRepository],
  exports: [OfflineAlertJobRepository],
})
export class OfflineAlertJobModule {}
