import { createChangeLogWithId } from '../stubs/changelog.stub';
import { createChangelogDto } from '../stubs/changelogDTO.stub';

export const ChangelogsService = jest.fn().mockReturnValue({
  create: jest
    .fn()
    .mockResolvedValue(createChangeLogWithId(createChangelogDto())),
  findAll: jest
    .fn()
    .mockResolvedValue([createChangeLogWithId(createChangelogDto())]),
  findOne: jest
    .fn()
    .mockResolvedValue(createChangeLogWithId(createChangelogDto())),
  update: jest
    .fn()
    .mockResolvedValue(
      createChangeLogWithId(createChangelogDto({ description: 'updated' })),
    ),
  remove: jest
    .fn()
    .mockResolvedValue(createChangeLogWithId(createChangelogDto())),
});
