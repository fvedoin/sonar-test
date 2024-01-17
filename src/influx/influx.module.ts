import { Module } from '@nestjs/common';
import { InfluxService } from './influx.service';
import { InfluxRepository } from './influx.repository';

@Module({
  providers: [InfluxService, InfluxRepository],
  exports: [InfluxService],
})
export class InfluxModule {}
