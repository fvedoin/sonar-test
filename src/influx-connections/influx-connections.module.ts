import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfluxBucketsModule } from 'src/influx-buckets/influx-buckets.module';

import {
  InfluxConnection,
  InfluxConnectionSchema,
} from './entities/influx-connection.entity';
import { InfluxConnectionsController } from './influx-connections.controller';
import { InfluxConnectionsService } from './influx-connections.service';
import { InfluxConnectionRepository } from './influx-connections.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InfluxConnection.name,
        schema: InfluxConnectionSchema,
      },
    ]),
    forwardRef(() => InfluxBucketsModule),
  ],
  controllers: [InfluxConnectionsController],
  providers: [InfluxConnectionsService, InfluxConnectionRepository],
  exports: [InfluxConnectionsService, InfluxConnectionRepository],
})
export class InfluxConnectionsModule {}
