import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from 'src/clients/clients.module';
import { InfluxConnectionsModule } from 'src/influx-connections/influx-connections.module';

import {
  InfluxBucket,
  InfluxBucketSchema,
} from './entities/influx-bucket.entity';
import { InfluxBucketsController } from './influx-buckets.controller';
import { InfluxBucketsService } from './influx-buckets.service';
import { InfluxBucketRepository } from './influx-buckets.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InfluxBucket.name,
        schema: InfluxBucketSchema,
      },
    ]),
    forwardRef(() => InfluxConnectionsModule),
    forwardRef(() => ClientsModule),
  ],
  controllers: [InfluxBucketsController],
  providers: [InfluxBucketsService, InfluxBucketRepository],
  exports: [InfluxBucketsService, InfluxBucketRepository],
})
export class InfluxBucketsModule {}
