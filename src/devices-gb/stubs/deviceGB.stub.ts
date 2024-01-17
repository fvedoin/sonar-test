import { Types } from 'mongoose';
import { DeviceGb } from '../entities/devices-gb.entity';
import { bucketStub } from './bucket.stub';

export const deviceGBStub = (
  id = '6401fdaf1224add8ade50026',
  deviceGb?: Partial<DeviceGb>,
) => {
  return {
    _id: new Types.ObjectId(id),
    allows: [],
    clientId: new Types.ObjectId('6401fdaf1224add8ade50026'),
    devId: '768',
    bucketId: bucketStub(),
    name: 'UC 768 desativada',
    communication: 'PIMA',
    type: 'LoRa',
    description: '',
    applicationId: {
      _id: new Types.ObjectId('62179b4f4e4e0029f068f7b6'),
      clientId: new Types.ObjectId('6401fdaf1224add8ade50026'),
      appId: 'qnponwwn49tv6khs',
      name: 'Application Telemedição Grupo B',
      token: '123',
      description: '',
    },
    ...deviceGb,
  };
};
