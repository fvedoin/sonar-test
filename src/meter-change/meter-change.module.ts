import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MeterChanges,
  MeterChangeSchema,
} from './entities/meter-change.entity';
import { MeterChangeController } from './meter-change.controller';
import { MeterChangeRepository } from './meter-change.repository';
import { MeterChangeService } from './meter-change.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MeterChanges.name,
        schema: MeterChangeSchema,
      },
    ]),
  ],
  controllers: [MeterChangeController],
  providers: [MeterChangeService, MeterChangeRepository],
  exports: [MeterChangeService, MeterChangeRepository],
})
export class MeterChangeModule {}
