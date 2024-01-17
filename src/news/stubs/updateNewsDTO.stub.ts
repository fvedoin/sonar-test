import { UpdateNewsDto } from '../dto/update-news.dto';

export const updateNewsDto = (dto?: Partial<UpdateNewsDto>): UpdateNewsDto => {
  return {
    image: '',
    title: 'teste',
    description: 's',
    url: 'test',
    ...dto,
  };
};
