import { Types } from 'mongoose';
import { DevicesGa } from '../entities/devices-ga.entity';

export const deviceGAStub = (
  id?: Types.ObjectId,
  deviceGb?: Partial<DevicesGa>,
): DevicesGa => {
  return {
    _id: id ?? new Types.ObjectId(),
    provider: 'TEST',
    clientId: new Types.ObjectId(),
    devId: String(Math.floor(Math.random() * 1000 + 1)),
    name: 'UC 768 desativada',
    description: '',
    ...deviceGb,
  };
};
