import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfluxBucketsModule } from 'src/influx-buckets/influx-buckets.module';
import { InfluxConnectionsModule } from 'src/influx-connections/influx-connections.module';

import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client, ClientSchema } from './entities/client.entity';
import { ClientsRepository } from './clients.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    forwardRef(() => InfluxConnectionsModule),
    forwardRef(() => InfluxBucketsModule),
  ],
  controllers: [ClientsController],
  providers: [ClientsService, ClientsRepository],
  exports: [ClientsService],
})
export class ClientsModule {}
