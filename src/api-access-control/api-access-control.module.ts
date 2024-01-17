import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ApiAccessControlController } from './api-access-control.controller';
import { ApiAccessControlService } from './api-access-control.service';
import {
  ApiAccessControl,
  ApiAccessControlSchema,
} from './entities/api-access-control.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApiAccessControl.name, schema: ApiAccessControlSchema },
    ]),
  ],
  controllers: [ApiAccessControlController],
  providers: [ApiAccessControlService],
})
export class ApiAccessControlModule {}
