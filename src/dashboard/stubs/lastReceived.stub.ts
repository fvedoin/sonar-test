import { Types } from 'mongoose';

export const lastReceivedStub = (deviceId?: Types.ObjectId) => ({
  deviceId,
  receivedAt: new Date(),
});
