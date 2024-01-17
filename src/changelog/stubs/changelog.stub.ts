import { Types } from 'mongoose';

import { CreateChangelogDto } from '../dto/create-changelogs.dto';
import { Changelog } from '../entities/changelogs.entity';

export const createChangeLogWithId = (
  createChangelogDto: CreateChangelogDto,
): Changelog => {
  return {
    ...createChangelogDto,
    _id: new Types.ObjectId('4edd40c86762e0fb12000003'),
  };
};
