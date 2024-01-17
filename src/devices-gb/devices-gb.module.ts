import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsModule } from 'src/applications/applications.module';
import { ClientsModule } from 'src/clients/clients.module';
import { InfluxBucketsModule } from 'src/influx-buckets/influx-buckets.module';
import { MqttAccessModule } from 'src/mqtt-access/mqtt-access.module';

import { DevicesGbController } from './devices-gb.controller';
import { DevicesGbService } from './devices-gb.service';
import { DeviceGb, DeviceGbSchema } from './entities/devices-gb.entity';
import { DevicesGbRepository } from './devices-gb.repository';
import { UcsModule } from 'src/ucs/ucs.module';
import { TransformersModule } from 'src/transformers/transformers.module';
import { UsersModule } from 'src/users/users.module';
import { NotificationModule } from 'src/notification/notification.module';
import { AlertModule } from 'src/alert/alert.module';
import { MeterChangeModule } from 'src/meter-change/meter-change.module';
import { CutReconnectModule } from 'src/cut-reconnect/cut-reconnect.module';
import { LastReceivedsModule } from 'src/last-receiveds/last-receiveds.module';
import { InfluxConnectionsModule } from 'src/influx-connections/influx-connections.module';
import { InfluxModule } from 'src/influx/influx.module';
import { OfflineAlertJobModule } from 'src/offline-alert-job/offline-alert-job.module';
import { OnlineAlertJobModule } from 'src/online-alert-job/online-alert-job.module';
import { JobModule } from 'src/job/job.module';
import { UcdisabledHistoryModule } from 'src/ucdisabled-history/ucdisabled-history.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeviceGb.name, schema: DeviceGbSchema },
    ]),
    forwardRef(() => UcsModule),
    forwardRef(() => ClientsModule),
    forwardRef(() => ApplicationsModule),
    forwardRef(() => InfluxBucketsModule),
    forwardRef(() => MqttAccessModule),
    TransformersModule,
    UsersModule,
    ClientsModule,
    NotificationModule,
    AlertModule,
    MeterChangeModule,
    CutReconnectModule,
    LastReceivedsModule,
    OfflineAlertJobModule,
    OnlineAlertJobModule,
    JobModule,
    UcdisabledHistoryModule,
    InfluxModule,
    InfluxBucketsModule,
    InfluxConnectionsModule,
  ],
  controllers: [DevicesGbController],
  providers: [DevicesGbService, DevicesGbRepository],
  exports: [DevicesGbService, DevicesGbRepository],
})
export class DevicesGbModule {}
