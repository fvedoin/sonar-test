import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { AbstractRepository } from 'src/common/database/abstract.repository';

import { Changelog } from './entities/changelogs.entity';

@Injectable()
export class ChangelogsRepository extends AbstractRepository<Changelog> {
  constructor(
    @InjectModel(Changelog.name) private changelogModel: Model<Changelog>,
    @InjectConnection() connection: Connection,
  ) {
    super(changelogModel, connection);
  }
}
