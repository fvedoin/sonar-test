import { Types } from 'mongoose';
import { DeviceTr } from '../entities/devices-tr.entity';

export const deviceTrStub = (): DeviceTr => {
  return {
    _id: new Types.ObjectId('63ca917253899d9c2e48a713'),
    name: 'IT 01',
    type: 'Smart Trafo',
    devId: 'SM',
    applicationId: new Types.ObjectId('619b87d595593f1f9c97f2c7'),
    clientId: new Types.ObjectId('4edd40c86762e0fb12000002'),
    bucketId: new Types.ObjectId('62179b4f4e4e0029f068f7b6'),
    mqttApplicationId: new Types.ObjectId('4edd40c86762e0fb12000003'),
  };
};
