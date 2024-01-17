import { Module } from '@nestjs/common';
import { AwsIotManagerService } from './aws-iot-manager.service';
import { AwsIotManagerController } from './aws-iot-manager.controller';
import { AwsIoTManagerRepository } from './aws-iot-manager.repository';

@Module({
  controllers: [AwsIotManagerController],
  providers: [AwsIotManagerService, AwsIoTManagerRepository],
  exports: [AwsIotManagerService],
})
export class AwsIotManagerModule {}
