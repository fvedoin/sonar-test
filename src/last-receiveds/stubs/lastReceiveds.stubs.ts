import { Types } from 'mongoose';

export const lastReceivedsStubs = () => ({
  deviceId: new Types.ObjectId('6351aed9f85a010f3cbf8d32'),
  port: 0,
  receivedAt: new Date('2021-04-01T00:00:00.000Z'),
});
