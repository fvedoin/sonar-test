import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Setting, SettingSchema } from './entities/setting.entity';
import { SettingsRepository } from './setting.repository';
import { SettingsController } from './setting.controller';
import { SettingsService } from './setting.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
    ClientsModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService, SettingsRepository, EventEmitter2],
  exports: [SettingsService],
})
export class SettingsModule {}
