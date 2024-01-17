import { Module } from '@nestjs/common';
import { UcdisabledHistoryService } from './ucdisabled-history.service';
import { UcdisabledHistoryController } from './ucdisabled-history.controller';
import { UcdisabledHistoryRepository } from './ucdisabled-history.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UcdisabledHistory,
  UcdisabledHistorySchema,
} from './entities/ucdisabled-history.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UcdisabledHistory.name, schema: UcdisabledHistorySchema },
    ]),
  ],
  controllers: [UcdisabledHistoryController],
  providers: [UcdisabledHistoryService, UcdisabledHistoryRepository],
  exports: [UcdisabledHistoryService],
})
export class UcdisabledHistoryModule {}
