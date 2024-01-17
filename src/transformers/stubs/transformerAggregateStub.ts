import { Types } from 'mongoose';
import { Transformer } from '../entities/transformer.entity';

export const transformersAggregateStub = (): Transformer => {
  return {
    _id: new Types.ObjectId('63ca917253899d9c2e48a713'),
    it: '12',
    serieNumber: '123456',
    tapLevel: 3,
    tap: 4,
    feeder: 'Feeder 1',
    city: 'City 1',
    loadLimit: 100,
    overloadTimeLimit: 60,
    nominalValue_i: 200,
    clientId: new Types.ObjectId('5f8b4c4e4e0c3d3f8c8b4567'),
    location: {
      type: 'Point',
      coordinates: [50.12345, -20.98765],
    },
  };
};
