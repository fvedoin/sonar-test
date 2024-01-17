import { CreateUcdisabledHistoryDto } from '../dto/create-ucdisabled-history.dto';
import { Types } from 'mongoose';

export const createUcdisabledHistoryDtoStubs = (
  dto?: Partial<CreateUcdisabledHistoryDto>,
): CreateUcdisabledHistoryDto => {
  return {
    clientId: new Types.ObjectId('6401fdaf1224add8ade50026'),
    ucId: new Types.ObjectId('6401fdaf1224add8ade50026'),
    deviceId: new Types.ObjectId('6401fdaf1224add8ade50026'),
    dataDeleted: true,
    userId: new Types.ObjectId('6401fdaf1224add8ade50026'),
    date: new Date('2023-08-30T14:00:00Z'),
  };
};
