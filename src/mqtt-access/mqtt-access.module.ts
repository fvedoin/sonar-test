import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MqttAccess, MqttAccessSchema } from './entities/mqtt-access.entity';
import { MqttAccessController } from './mqtt-access.controller';
import { MqttAccessService } from './mqtt-access.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MqttAccess.name,
        schema: MqttAccessSchema,
      },
    ]),
  ],
  controllers: [MqttAccessController],
  providers: [MqttAccessService],
  exports: [MqttAccessService],
})
export class MqttAccessModule {}
