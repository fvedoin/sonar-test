import { createChangeLogWithId } from '../stubs/changelog.stub';
import { createChangelogDto } from '../stubs/changelogDTO.stub';

export const ChangelogsRepository = jest.fn().mockReturnValue({
  create: jest
    .fn()
    .mockResolvedValue(createChangeLogWithId(createChangelogDto())),
  find: jest
    .fn()
    .mockResolvedValue([createChangeLogWithId(createChangelogDto())]),
  findOne: jest
    .fn()
    .mockResolvedValue(createChangeLogWithId(createChangelogDto())),
  findOneAndUpdate: jest
    .fn()
    .mockResolvedValue(
      createChangeLogWithId(createChangelogDto({ description: 'updated' })),
    ),
  delete: jest
    .fn()
    .mockResolvedValue(createChangeLogWithId(createChangelogDto())),
});
