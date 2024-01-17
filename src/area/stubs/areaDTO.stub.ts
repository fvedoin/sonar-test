import { Types } from 'mongoose';
import { CreateAreaDto } from '../dto/create-area.dto';

export const areaDtoStubs = (dto?: Partial<CreateAreaDto>): CreateAreaDto => {
  return {
    name: 'Area 1',
    clientId: new Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
    points: [
      {
        lat: null,
        lng: null,
      },
    ],
    ...dto,
  };
};
