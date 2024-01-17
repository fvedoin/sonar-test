import { Module } from '@nestjs/common';
import { EnergyService } from './energy.service';
import { EnergyController } from './energy.controller';
import { UcsModule } from 'src/ucs/ucs.module';
import { InfluxBucketsModule } from 'src/influx-buckets/influx-buckets.module';
import { InfluxConnectionsModule } from 'src/influx-connections/influx-connections.module';
import { MeterChangeModule } from 'src/meter-change/meter-change.module';

@Module({
  imports: [
    UcsModule,
    InfluxBucketsModule,
    InfluxConnectionsModule,
    MeterChangeModule,
  ],
  controllers: [EnergyController],
  providers: [EnergyService],
  exports: [EnergyService],
})
export class EnergyModule {}
