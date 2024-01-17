import { Module } from '@nestjs/common';
import { FaultsService } from './faults.service';
import { FaultsController } from './faults.controller';
import { InfluxBucketsModule } from 'src/influx-buckets/influx-buckets.module';
import { InfluxConnectionsModule } from 'src/influx-connections/influx-connections.module';
import { InfluxModule } from 'src/influx/influx.module';
import { UcsModule } from 'src/ucs/ucs.module';

@Module({
  imports: [
    InfluxBucketsModule,
    InfluxConnectionsModule,
    InfluxModule,
    UcsModule,
  ],
  controllers: [FaultsController],
  providers: [FaultsService],
})
export class FaultsModule {}
