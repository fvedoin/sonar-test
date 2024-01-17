import { Module } from '@nestjs/common';
import { AwsS3ManagerService } from './aws-s3-manager.service';
import { AwsS3ManagerController } from './aws-s3-manager.controller';
import { AwsS3ManagerRepository } from './aws-s3-manager.repository';

@Module({
  controllers: [AwsS3ManagerController],
  providers: [AwsS3ManagerService, AwsS3ManagerRepository],
  exports: [AwsS3ManagerService],
})
export class AwsS3ManagerModule {}
