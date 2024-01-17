import { Module, forwardRef } from '@nestjs/common';
import { AlertsHistoryService } from './alerts-history.service';
import { AlertsHistoryController } from './alerts-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AlertHistory,
  AlertsHistorySchema,
} from './entities/alerts-history.entity';
import { AlertsHistoryRepository } from './alerts-history.repository';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    forwardRef(() => ClientsModule),
    MongooseModule.forFeature([
      { name: AlertHistory.name, schema: AlertsHistorySchema },
    ]),
  ],
  controllers: [AlertsHistoryController],
  providers: [AlertsHistoryService, AlertsHistoryRepository],
  exports: [AlertsHistoryRepository],
})
export class AlertsHistoryModule {}
