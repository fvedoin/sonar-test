import { Types } from 'mongoose';

export const settingsStub = (clientId?: Types.ObjectId) => ({
  clientId,
  offlineTime: 5,
});
