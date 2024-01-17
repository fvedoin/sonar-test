import { Types } from 'mongoose';
import { DeviceGb } from 'src/devices-gb/entities/devices-gb.entity';

export const deviceFakes = (_id: string, bucketId: string): DeviceGb => ({
  _id: new Types.ObjectId(_id),
  allows: ['quality', 'measurements', 'faults', 'cutReconnect'],
  clientId: new Types.ObjectId('63fdef9d4f531800316c6b75'),
  devId: new Types.ObjectId().toString(),
  type: 'LoRa',
  communication: 'ABNT NBR 14522',
  bucketId,
  description: null,
  name: 'Dispositivo (Beta)',
  applicationId: new Types.ObjectId('619b87d595593f1f9c97f2c7'),
});
