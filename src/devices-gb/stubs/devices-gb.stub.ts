import { Types } from 'mongoose';
import { DeviceGb } from '../entities/devices-gb.entity';

export const deviceGbStub = (): DeviceGb => {
  return {
    _id: new Types.ObjectId('63ca917253899d9c2e48a713'),
    clientId: new Types.ObjectId('63ca917253899d9c2e48a713'),
    applicationId: new Types.ObjectId('63ca917253899d9c2e48a713'),
    bucketId: new Types.ObjectId('63ca917253899d9c2e48a713'),
    communication: 'PIMA',
    type: 'LoRa',
    devId: 'fxrl-00',
    name: 'fxrl-00',
    description: '',
    allows: ['Qualidade', 'faltas'],
  };
};
