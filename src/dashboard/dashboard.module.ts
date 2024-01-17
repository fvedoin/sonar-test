import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { InfluxModule } from 'src/influx/influx.module';
import { UcsModule } from 'src/ucs/ucs.module';
import { InfluxConnectionsModule } from 'src/influx-connections/influx-connections.module';
import { ClientsModule } from 'src/clients/clients.module';
import { InfluxBucketsModule } from 'src/influx-buckets/influx-buckets.module';
import { SettingsModule } from 'src/settings/setting.module';
import { LastReceivedsModule } from 'src/last-receiveds/last-receiveds.module';
import { NotificationModule } from 'src/notification/notification.module';
import { CutReconnectModule } from 'src/cut-reconnect/cut-reconnect.module';
import { EnergyModule } from 'src/energy/energy.module';

@Module({
  imports: [
    ClientsModule,
    CutReconnectModule,
    InfluxBucketsModule,
    InfluxConnectionsModule,
    InfluxModule,
    LastReceivedsModule,
    NotificationModule,
    SettingsModule,
    UcsModule,
    EnergyModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
