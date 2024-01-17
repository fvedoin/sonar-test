import { CreateChangelogDto } from '../dto/create-changelogs.dto';

export const createChangelogDto = (
  dto?: Partial<CreateChangelogDto>,
): CreateChangelogDto => {
  return {
    description: 'Test',
    version: '1.0.0',
    ...dto,
  };
};
