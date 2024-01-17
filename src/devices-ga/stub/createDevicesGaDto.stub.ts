import { Types } from 'mongoose';
import { CreateDevicesGaDto } from '../dto/create-devices-ga.dto';

export const createDevicesGaDtoStub = (
  id = '6401fdaf1224add8ade50026',
): CreateDevicesGaDto => {
  return {
    clientId: new Types.ObjectId('6401fdaf1224add8ade50026'),
    devId: 'thingName',
    name: 'UC 768',
    description: '',
    provider: 'aws',
  };
};
