import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  LastReceived,
  LastReceivedSchema,
} from './entities/last-received.entity';
import { LastReceivedsService } from './last-receiveds.service';
import { LastReceivedsRepository } from './last-receiveds.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LastReceived.name, schema: LastReceivedSchema },
    ]),
  ],
  providers: [LastReceivedsService, LastReceivedsRepository],
  exports: [LastReceivedsService, LastReceivedsRepository],
})
export class LastReceivedsModule {}
