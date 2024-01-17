import { Types } from 'mongoose';

interface Location {
  type: string;
  coordinates: [number, number];
  _id: string;
}

interface FindOneResponse {
  _id: Types.ObjectId;
  ttnId: string;
  __v: number;
  clientId: string[];
  lastChecked: string;
  online: boolean;
  location: Location;
  name: string;
}

export const findOneResponseStub: FindOneResponse = {
  _id: new Types.ObjectId('4edd40c86762e0fb12000003'),
  ttnId: 'poiuytrewq',
  __v: 0,
  clientId: ['64de077bd89e32004e59fb37'],
  lastChecked: '2023-08-30T18:46:59.737Z',
  online: false,
  location: {
    type: 'Point',
    coordinates: [-0.01292, 0.03772],
    _id: '64f1e444d1b302d5f3784508',
  },
  name: 'bjnkml',
};
