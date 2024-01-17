import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, AreaSchema } from './entities/area.entity';
import { AreaRepository } from './area.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Area.name,
        schema: AreaSchema,
      },
    ]),
  ],
  controllers: [AreaController],
  providers: [AreaService, AreaRepository],
})
export class AreaModule {}
