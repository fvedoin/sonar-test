import { Types } from 'mongoose';
import { UpdateDevicesGaDto } from '../dto/update-devices-ga.dto';

export const updateDevicesGaDtoStub = (): UpdateDevicesGaDto => {
  return {
    clientId: new Types.ObjectId('62179b4f4e4e0029f068f7b6'),
    name: 'UC 768 atualizada',
    description: 'update',
    provider: 'IOT-Update',
    authenticated: true,
    devId: 'updated-111',
  };
};
