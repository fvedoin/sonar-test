import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesGbModule } from 'src/devices-gb/devices-gb.module';
import { TransformersModule } from 'src/transformers/transformers.module';
import { UsersModule } from 'src/users/users.module';
import { Uc, UcSchema } from './entities/uc.entity';
import { UcsController } from './ucs.controller';
import { UcsService } from './ucs.service';
import { UcsRepository } from './ucs.repository';
import { ClientsModule } from 'src/clients/clients.module';
import { NotificationModule } from 'src/notification/notification.module';
import { InfluxBucketsModule } from 'src/influx-buckets/influx-buckets.module';
import { UcdisabledHistoryModule } from 'src/ucdisabled-history/ucdisabled-history.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Uc.name, schema: UcSchema }]),
    forwardRef(() => DevicesGbModule),
    TransformersModule,
    UsersModule,
    ClientsModule,
    NotificationModule,
    UcdisabledHistoryModule,
    InfluxBucketsModule,
  ],
  controllers: [UcsController],
  providers: [UcsService, UcsRepository],
  exports: [UcsService, UcsRepository],
})
export class UcsModule {}
