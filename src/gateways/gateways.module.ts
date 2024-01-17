import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from 'src/clients/clients.module';

import { Gateway, GatewaySchema } from './entities/gateway.entity';
import { GatewaysController } from './gateways.controller';
import { GatewaysService } from './gateways.service';
import { GatewaysRepository } from './gateways.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gateway.name, schema: GatewaySchema }]),
    forwardRef(() => ClientsModule),
  ],
  controllers: [GatewaysController],
  providers: [GatewaysService, GatewaysRepository],
})
export class GatewaysModule {}
