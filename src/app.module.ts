import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as redisStore from 'cache-manager-redis-store';
import { AwsSdkModule } from 'aws-sdk-v3-nest';
import { S3Client } from '@aws-sdk/client-s3';
import { IoTClient } from '@aws-sdk/client-iot';
import { ApiAccessControlModule } from './api-access-control/api-access-control.module';
import { ApplicationsModule } from './applications/applications.module';
import { AreaModule } from './area/area.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ChangelogsModule } from './changelog/changelog.module';
import { ClientsModule } from './clients/clients.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './common/database/database.module';
import { DevicesGbModule } from './devices-gb/devices-gb.module';
import { DevicesTrModule } from './devices-tr/devices-tr.module';
import { GatewaysModule } from './gateways/gateways.module';
import { InfluxBucketsModule } from './influx-buckets/influx-buckets.module';
import { InfluxConnectionsModule } from './influx-connections/influx-connections.module';
import { LastReceivedsModule } from './last-receiveds/last-receiveds.module';
import { MeterChangeModule } from './meter-change/meter-change.module';
import { MqttAccessModule } from './mqtt-access/mqtt-access.module';
import { NewsModule } from './news/news.module';
import { NotificationModule } from './notification/notification.module';
import { SettingsModule } from './settings/setting.module';
import { TransformersModule } from './transformers/transformers.module';
import { UcsModule } from './ucs/ucs.module';
import { UsersModule } from './users/users.module';
import { XmlModule } from './xml/xml.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InfluxModule } from './influx/influx.module';
import { EnergyModule } from './energy/energy.module';
import { AwsS3ManagerModule } from './aws-s3-manager/aws-s3-manager.module';
import { AlertsHistoryModule } from './alerts-history/alerts-history.module';
import { TokenModule } from './token/token.module';
import { RabbitMQModule } from './rabbit-mq/rabbit-mq.module';
import { OfflineAlertJobModule } from './offline-alert-job/offline-alert-job.module';
import { JobModule } from './job/job.module';
import { OnlineAlertJobModule } from './online-alert-job/online-alert-job.module';
import { AlertModule } from './alert/alert.module';
import { UcdisabledHistoryModule } from './ucdisabled-history/ucdisabled-history.module';
import { FaultsModule } from './faults/faults.module';
import { AlertGatewayModule } from './alert-gateway/alert-gateway.module';
import { DevicesGaModule } from './devices-ga/devices-ga.module';

@Module({
  imports: [
    RabbitMQModule,
    AwsSdkModule.register({
      isGlobal: true,
      client: new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      }),
    }),
    AwsSdkModule.register({
      isGlobal: true,
      client: new IoTClient({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      }),
    }),
    EventEmitterModule.forRoot({ wildcard: true, delimiter: '.' }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    }),
    ClientsModule,
    UsersModule,
    AuthModule,
    TokenModule,
    ApiAccessControlModule,
    InfluxConnectionsModule,
    InfluxBucketsModule,
    CommonModule,
    NewsModule,
    NotificationModule,
    MqttAccessModule,
    TransformersModule,
    MeterChangeModule,
    SettingsModule,
    ChangelogsModule,
    UcsModule,
    XmlModule,
    AreaModule,
    DevicesGbModule,
    ApplicationsModule,
    LastReceivedsModule,
    DevicesTrModule,
    GatewaysModule,
    DashboardModule,
    InfluxModule,
    EnergyModule,
    AwsS3ManagerModule,
    AlertsHistoryModule,
    OfflineAlertJobModule,
    JobModule,
    OnlineAlertJobModule,
    AlertModule,
    UcdisabledHistoryModule,
    FaultsModule,
    AlertGatewayModule,
    DevicesGaModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
