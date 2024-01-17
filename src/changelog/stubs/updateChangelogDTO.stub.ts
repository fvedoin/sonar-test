import { UpdateChangelogDto } from '../dto/update-changelogs.dto';

export const updateChangelogDto = (
  dto?: Partial<UpdateChangelogDto>,
): UpdateChangelogDto => {
  return {
    description: 'Test',
    version: '1.0.0',
    ...dto,
  };
};
