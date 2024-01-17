import { Types } from 'mongoose';
import { Uc } from 'src/ucs/entities/uc.entity';

export const ucStubs = (random?: string): Partial<Uc> => ({
  ucCode: random || '10249',
  timeZone: 'America/Sao_Paulo',
  deviceId: {
    _id: new Types.ObjectId('61a8f7d1a1017b2168ce00dc'),
    allows: ['quality', 'measurements', 'faults', 'cutReconnect'],
    clientId: new Types.ObjectId('63fdef9d4f531800316c6b75'),
    devId: 'fxrl-00',
    type: 'LoRa',
    communication: 'ABNT NBR 14522',
    __v: 0,
    bucketId: new Types.ObjectId('62179b4f4e4e0029f068f7b6'),
    description: null,
    name: 'Dispositivo (Beta)',
    applicationId: new Types.ObjectId('619b87d595593f1f9c97f2c7'),
  },
});
