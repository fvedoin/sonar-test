import { CreateNewsDto } from '../dto/create-news.dto';

export const createNewsDto = (dto?: Partial<CreateNewsDto>): CreateNewsDto => {
  return {
    image: '',
    title: 'teste',
    description: 's',
    url: 'test',
    ...dto,
  };
};
