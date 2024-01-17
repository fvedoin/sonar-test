import { Module } from '@nestjs/common';
import { CutConnectRepository } from './cut-reconnect.repository';
import { CutReconnectController } from './cut-reconnect.controller';
import { CutReconnectService } from './cut-reconnect.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CutReconnect,
  CutReconnectSchema,
} from './entities/cut-reconnect.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CutReconnect.name,
        schema: CutReconnectSchema,
      },
    ]),
  ],
  controllers: [CutReconnectController],
  providers: [CutReconnectService, CutConnectRepository],
  exports: [CutReconnectService, CutConnectRepository],
})
export class CutReconnectModule {}
