import { Module } from '@nestjs/common';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert, AlertSchema } from './entities/alert.entity';
import { AlertRepository } from './alert.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Alert.name,
        schema: AlertSchema,
      },
    ]),
  ],
  controllers: [AlertController],
  providers: [AlertService, AlertRepository],
  exports: [AlertRepository],
})
export class AlertModule {}
