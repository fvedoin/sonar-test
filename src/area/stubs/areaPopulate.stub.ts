import { Types } from 'mongoose';
import { Area } from '../entities/area.entity';

export const areaPopulateStub = (): Area => {
  return {
    _id: new Types.ObjectId('63ca917253899d9c2e48a713'),
    name: 'Area 1',
    clientId: {
      _id: new Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
      name: 'Client 1',
      initials: 'CL1',
      cnpj: '12345678901234',
      aneelcode: '',
      local: '',
      address: '',
      active: true,
      modules: [''],
      parentId: new Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
    },
    points: [
      {
        type: 'Point',
        coordinates: [0, 0],
      },
    ],
  };
};
