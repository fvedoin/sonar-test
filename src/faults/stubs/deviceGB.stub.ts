import { Types } from 'mongoose';
import { CreateDevicesGbDto } from 'src/devices-gb/dto/create-devices-gb.dto';

export const deviceGBStub = (
  id = '6401fdaf1224add8ade50026',
  dto?: Partial<CreateDevicesGbDto>,
) => {
  return {
    _id: new Types.ObjectId(id),
    allows: [],
    clientId: new Types.ObjectId('6401fdaf1224add8ade50026'),
    devId: '768',
    bucketId: new Types.ObjectId('62179b4f4e4e0029f068f7b6'),
    name: 'UC 768 desativada',
    communication: 'PIMA',
    type: 'LoRa',
    description: '',
    applicationId: new Types.ObjectId('62179b4f4e4e0029f068f7b6'),
    ...dto,
  };
};
