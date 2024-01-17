import { Module } from '@nestjs/common';
import { InfluxBucketsModule } from 'src/influx-buckets/influx-buckets.module';
import { InfluxConnectionsModule } from 'src/influx-connections/influx-connections.module';
import { UcsModule } from 'src/ucs/ucs.module';

import { XmlController } from './xml.controller';
import { XmlService } from './xml.service';
import { CreateCSVListener } from './listeners/createCSV.listener';
import { InfluxModule } from 'src/influx/influx.module';
import { AwsS3ManagerModule } from 'src/aws-s3-manager/aws-s3-manager.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    UcsModule,
    InfluxBucketsModule,
    InfluxConnectionsModule,
    InfluxModule,
    AwsS3ManagerModule,
    NotificationModule,
  ],
  controllers: [XmlController],
  providers: [XmlService, CreateCSVListener],
})
export class XmlModule {}
