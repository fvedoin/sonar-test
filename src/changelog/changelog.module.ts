import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChangelogsController } from './changelog.controller';
import { ChangelogsRepository } from './changelog.repository';
import { ChangelogsService } from './changelog.service';
import { Changelog, ChangelogSchema } from './entities/changelogs.entity';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Changelog.name, schema: ChangelogSchema },
    ]),
  ],
  controllers: [ChangelogsController],
  providers: [ChangelogsService, ChangelogsRepository],
  exports: [ChangelogsService],
})
export class ChangelogsModule {}
