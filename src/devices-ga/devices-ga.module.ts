import { Module } from '@nestjs/common';
import { DevicesGaService } from './devices-ga.service';
import { DevicesGaController } from './devices-ga.controller';
import { DevicesGaRepository } from './devices-ga.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceGaSchema, DevicesGa } from './entities/devices-ga.entity';
import { AwsIotManagerModule } from 'src/aws-iot-manager/aws-iot-manager.module';
import { AwsS3ManagerModule } from 'src/aws-s3-manager/aws-s3-manager.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DevicesGa.name, schema: DeviceGaSchema },
    ]),
    AwsIotManagerModule,
    AwsS3ManagerModule,
  ],
  controllers: [DevicesGaController],
  providers: [DevicesGaService, DevicesGaRepository],
})
export class DevicesGaModule {}
