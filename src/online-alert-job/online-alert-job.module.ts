import { Module } from '@nestjs/common';
import { OnlineAlertJobService } from './online-alert-job.service';
import { OnlineAlertJobController } from './online-alert-job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OnlineAlertJob,
  OnlineAlertJobSchema,
} from './entities/online-alert-job.entity';
import { OnlineAlertJobRepository } from './job.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OnlineAlertJob.name, schema: OnlineAlertJobSchema },
    ]),
  ],
  controllers: [OnlineAlertJobController],
  providers: [OnlineAlertJobService, OnlineAlertJobRepository],
  exports: [OnlineAlertJobRepository],
})
export class OnlineAlertJobModule {}
