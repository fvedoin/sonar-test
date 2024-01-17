import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from 'src/clients/clients.module';
import { InfluxBucketsModule } from 'src/influx-buckets/influx-buckets.module';
import { MqttAccessModule } from 'src/mqtt-access/mqtt-access.module';
import { DevicesTrController } from './devices-tr.controller';
import { DevicesTrService } from './devices-tr.service';
import { DeviceTr, DeviceTrSchema } from './entities/devices-tr.entity';
import { DevicesTrRepository } from './devices-tr.repository';
import { InfluxModule } from 'src/influx/influx.module';
import { InfluxConnectionsModule } from 'src/influx-connections/influx-connections.module';
import { TransformersModule } from 'src/transformers/transformers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeviceTr.name, schema: DeviceTrSchema },
    ]),
    ClientsModule,
    MqttAccessModule,
    InfluxBucketsModule,
    TransformersModule,
    InfluxModule,
    InfluxConnectionsModule,
  ],
  controllers: [DevicesTrController],
  providers: [DevicesTrService, DevicesTrRepository],
})
export class DevicesTrModule {}
