import { Module } from '@nestjs/common';
import { AlertGatewayService } from './alert-gateway.service';
import { AlertGatewayController } from './alert-gateway.controller';
import { AlertGatewayRepository } from './alert-gateway.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AlertGateway,
  AlertGatewaySchema,
} from './entities/alert-gateway.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AlertGateway.name,
        schema: AlertGatewaySchema,
      },
    ]),
  ],
  controllers: [AlertGatewayController],
  providers: [AlertGatewayService, AlertGatewayRepository],
})
export class AlertGatewayModule {}
