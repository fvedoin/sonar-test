import { Types } from 'mongoose';
import { News } from '../entities/news.entity';

export const newsStub = (): News => {
  return {
    _id: new Types.ObjectId('63c840f1e92e56db70b7c1e8'),
    description: 'teste',
    image: '',
    url: 'teste3',
    title: 'teste4',
  };
};
