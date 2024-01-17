import { Controller, Post, Body } from '@nestjs/common';
import { AwsIotManagerService } from './aws-iot-manager.service';
import { CreateThingCommandInput } from '@aws-sdk/client-iot';

@Controller('aws-iot-manager')
export class AwsIotManagerController {
  constructor(private readonly awsIotManagerService: AwsIotManagerService) {}

  @Post()
  create(@Body() createAwsIotManagerDto: CreateThingCommandInput) {
    return this.awsIotManagerService.create(createAwsIotManagerDto);
  }
}
